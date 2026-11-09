// Equity-curve chart for the RSI backtester page, drawn with D3 v7.
// Data: assets/data/rsi-backtest.json, exported from a real run of
// sp500_rsi_trader (^GSPC, 2020-01-01 to 2026-09-27). Colours and fonts come
// from css/style.css classes, which reference css/tokens.css.
(function () {
  const figure = document.getElementById('equity-chart');
  if (!figure || typeof d3 === 'undefined') return;
  const plot = figure.querySelector('.chart__plot');

  const parse = d3.timeParse('%Y-%m-%d');
  const money = d3.format('$,.0f');
  const moneyShort = (v) => (v === 0 ? '$0' : `$${d3.format('.0f')(v / 1000)}k`);
  const dateLong = d3.timeFormat('%-d %b %Y');

  d3.json('../assets/data/rsi-backtest.json')
    .then((data) => {
      const days = data.days.map((d) => ({ date: parse(d.d), s: d.s, b: d.b, rsi: d.rsi }));
      const held = data.trades.map((t) => ({ entry: parse(t.entry), exit: parse(t.exit), pnl: t.pnl }));
      const tip = d3.select(plot).append('div').attr('class', 'chart__tip').attr('aria-hidden', 'true');

      const draw = () => render(days, held, tip);
      draw();
      let width = plot.clientWidth;
      new ResizeObserver(() => {
        // Redraw on the next frame so the new SVG's height change doesn't
        // land inside this observer callback.
        if (plot.clientWidth !== width) { width = plot.clientWidth; requestAnimationFrame(draw); }
      }).observe(plot);
    })
    .catch(() => {
      plot.innerHTML = '<p class="chart__error">The chart data didn\'t load. The figures above come from the same run.</p>';
    });

  function render(days, held, tip) {
    const width = plot.clientWidth;
    const narrow = width < 520;
    const height = narrow ? 260 : 340;
    const m = { top: 12, right: narrow ? 16 : 92, bottom: 44, left: 58 };
    const w = width - m.left - m.right;
    const h = height - m.top - m.bottom;

    const x = d3.scaleUtc().domain(d3.extent(days, (d) => d.date)).range([0, w]);
    const y = d3.scaleLinear()
      .domain([0, d3.max(days, (d) => Math.max(d.s, d.b))]).nice()
      .range([h, 0]);

    d3.select(plot).select('svg').remove();
    const svg = d3.select(plot).append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('role', 'img')
      .attr('aria-label', 'Line chart of a $100,000 portfolio from January 2020 to September 2026. ' +
        'Buy-and-hold ends near $222,300; the RSI strategy ends near $121,196, ' +
        'holding a position in only six short periods.');
    const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

    // Periods in a position
    g.append('g').selectAll('rect').data(held).join('rect')
      .attr('class', 'held')
      .attr('x', (d) => x(d.entry))
      .attr('width', (d) => Math.max(2, x(d.exit) - x(d.entry)))
      .attr('y', 0).attr('height', h);

    // Grid + axes
    g.append('g').attr('class', 'grid')
      .call(d3.axisLeft(y).ticks(5).tickSize(-w).tickFormat(''));
    g.append('g').attr('class', 'axis').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).ticks(narrow ? 4 : 7).tickSizeOuter(0));
    g.append('g').attr('class', 'axis')
      .call(d3.axisLeft(y).ticks(5).tickFormat(moneyShort).tickSizeOuter(0));

    g.append('text').attr('class', 'axis-label')
      .attr('x', w / 2).attr('y', h + 36).attr('text-anchor', 'middle')
      .text('Date');
    g.append('text').attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -h / 2).attr('y', -46).attr('text-anchor', 'middle')
      .text('Portfolio value (USD)');

    // Lines
    const line = (key) => d3.line().x((d) => x(d.date)).y((d) => y(d[key]));
    g.append('path').datum(days).attr('class', 'line line--hold').attr('d', line('b'));
    g.append('path').datum(days).attr('class', 'line line--strategy').attr('d', line('s'));

    // Direct labels at the line ends (a legend on narrow screens)
    const last = days[days.length - 1];
    if (narrow) {
      const lg = g.append('g').attr('transform', 'translate(8,6)');
      lg.append('text').attr('class', 'end-label--hold').attr('y', 0).text('— Buy & hold');
      lg.append('text').attr('class', 'end-label--strategy').attr('y', 14).text('— RSI strategy');
    } else {
      g.append('text').attr('class', 'end-label--hold')
        .attr('x', w + 8).attr('y', y(last.b)).attr('dy', '0.32em').text('Buy & hold');
      g.append('text').attr('class', 'end-label--strategy')
        .attr('x', w + 8).attr('y', y(last.s)).attr('dy', '0.32em').text('RSI strategy');
    }

    // Hover / touch readout
    const cursor = g.append('line').attr('class', 'cursor').attr('y1', 0).attr('y2', h).style('display', 'none');
    const dotS = g.append('circle').attr('class', 'dot--strategy').attr('r', 3.5).style('display', 'none');
    const dotB = g.append('circle').attr('class', 'dot--hold').attr('r', 3).style('display', 'none');
    const bisect = d3.bisector((d) => d.date).center;

    const show = (event) => {
      const [px] = d3.pointer(event, g.node());
      const d = days[bisect(days, x.invert(Math.max(0, Math.min(w, px))))];
      const inTrade = held.some((t) => d.date >= t.entry && d.date <= t.exit);
      const cx = x(d.date);
      cursor.attr('x1', cx).attr('x2', cx).style('display', null);
      dotS.attr('cx', cx).attr('cy', y(d.s)).style('display', null);
      dotB.attr('cx', cx).attr('cy', y(d.b)).style('display', null);

      tip.html(
        `<strong>${dateLong(d.date)}</strong>` +
        '<dl>' +
        `<dt>Strategy</dt><dd>${money(d.s)}</dd>` +
        `<dt>Buy &amp; hold</dt><dd>${money(d.b)}</dd>` +
        `<dt>RSI(14)</dt><dd>${d.rsi.toFixed(1)}</dd>` +
        `<dt>Position</dt><dd>${inTrade ? 'held' : 'cash'}</dd>` +
        '</dl>'
      ).classed('is-on', true);

      // Keep the tooltip inside the chart: flip it to the left of the cursor near the right edge.
      const tipW = tip.node().offsetWidth;
      const left = m.left + cx + 12 + tipW > width ? m.left + cx - 12 - tipW : m.left + cx + 12;
      tip.style('transform', `translate(${Math.max(0, left)}px, ${m.top + 4}px)`);
    };
    const hide = () => {
      cursor.style('display', 'none');
      dotS.style('display', 'none');
      dotB.style('display', 'none');
      tip.classed('is-on', false);
    };

    g.append('rect')
      .attr('width', w).attr('height', h)
      .attr('fill', 'transparent')
      .on('pointerenter pointermove', show)
      .on('pointerleave', hide);
  }
})();
