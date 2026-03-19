const W = 860, H = 580;

const RAW = [
  ["Nature","Accepting Limitations"],["Nature","Accepting Limitations"],["Nature","Accepting Limitations"],["Nature","Accepting Limitations"],["Nature","Accepting Limitations"],
  ["Nature","Appreciating Life"],["Nature","Appreciating Life"],["Nature","Appreciating Life"],["Nature","Appreciating Life"],["Nature","Appreciating Life"],["Nature","Appreciating Life"],
  ["Nature","Appreciating the World"],["Nature","Appreciating the World"],["Nature","Appreciating the World"],["Nature","Appreciating the World"],["Nature","Appreciating the World"],["Nature","Appreciating the World"],
  ["Nature","Be Kind"],["Nature","Be Kind"],["Nature","Be Kind"],
  ["Nature","Friendship"],
  ["Nature","Perseverance"],
  ["Nature","Positive Future"],["Nature","Positive Future"],["Nature","Positive Future"],["Nature","Positive Future"],
  ["Nature","Reframing Negatives"],["Nature","Reframing Negatives"],["Nature","Reframing Negatives"],["Nature","Reframing Negatives"],["Nature","Reframing Negatives"],["Nature","Reframing Negatives"],
  ["Nature","Focus on Yourself"],["Nature","Focus on Yourself"],
  ["Nature","Meta"],
  ["Nature","Self-Knowledge"],["Nature","Self-Knowledge"],["Nature","Self-Knowledge"],
  ["Human","Feel-Good Stories"],["Human","Feel-Good Stories"],["Human","Feel-Good Stories"],["Human","Feel-Good Stories"],["Human","Feel-Good Stories"],["Human","Feel-Good Stories"],["Human","Feel-Good Stories"],["Human","Feel-Good Stories"],["Human","Feel-Good Stories"],
  ["Human","Positive Future"],["Human","Positive Future"],["Human","Positive Future"],["Human","Positive Future"],["Human","Positive Future"],["Human","Positive Future"],["Human","Positive Future"],["Human","Positive Future"],["Human","Positive Future"],
  ["Human","Self-Knowledge"],["Human","Self-Knowledge"],["Human","Self-Knowledge"],["Human","Self-Knowledge"],["Human","Self-Knowledge"],["Human","Self-Knowledge"],["Human","Self-Knowledge"],
  ["Human","Reframing Negatives"],["Human","Reframing Negatives"],["Human","Reframing Negatives"],["Human","Reframing Negatives"],["Human","Reframing Negatives"],["Human","Reframing Negatives"],["Human","Reframing Negatives"],["Human","Reframing Negatives"],
  ["Human","Appreciating Life"],["Human","Appreciating Life"],["Human","Appreciating Life"],["Human","Appreciating Life"],["Human","Appreciating Life"],["Human","Appreciating Life"],["Human","Appreciating Life"],["Human","Appreciating Life"],["Human","Appreciating Life"],["Human","Appreciating Life"],["Human","Appreciating Life"],["Human","Appreciating Life"],["Human","Appreciating Life"],["Human","Appreciating Life"],["Human","Appreciating Life"],
  ["Human","Focus on Yourself"],["Human","Focus on Yourself"],["Human","Focus on Yourself"],["Human","Focus on Yourself"],["Human","Focus on Yourself"],["Human","Focus on Yourself"],["Human","Focus on Yourself"],["Human","Focus on Yourself"],["Human","Focus on Yourself"],
  ["Human","Be Kind"],["Human","Be Kind"],["Human","Be Kind"],["Human","Be Kind"],["Human","Be Kind"],["Human","Be Kind"],["Human","Be Kind"],
  ["Human","Whimsy"],["Human","Whimsy"],["Human","Whimsy"],["Human","Whimsy"],
  ["Human","Meta"],["Human","Meta"],["Human","Meta"],["Human","Meta"],
  ["Human","Accepting Limitations"],["Human","Accepting Limitations"],["Human","Accepting Limitations"],["Human","Accepting Limitations"],
  ["Human","Appreciating the World"],["Human","Appreciating the World"],
  ["Human","Friendship"],["Human","Friendship"],
  ["Human","Perseverance"],["Human","Perseverance"],
  ["Human","Bits of Encouragement"],
  ["Animal","Reframing Negatives"],["Animal","Reframing Negatives"],["Animal","Reframing Negatives"],["Animal","Reframing Negatives"],
  ["Animal","Self-Knowledge"],["Animal","Self-Knowledge"],["Animal","Self-Knowledge"],["Animal","Self-Knowledge"],["Animal","Self-Knowledge"],
  ["Animal","Positive Future"],["Animal","Positive Future"],["Animal","Positive Future"],["Animal","Positive Future"],["Animal","Positive Future"],
  ["Animal","Focus on Yourself"],["Animal","Focus on Yourself"],["Animal","Focus on Yourself"],
  ["Animal","Feel-Good Stories"],["Animal","Feel-Good Stories"],
  ["Animal","Be Kind"],["Animal","Be Kind"],["Animal","Be Kind"],
  ["Animal","Appreciating Life"],["Animal","Appreciating Life"],["Animal","Appreciating Life"],["Animal","Appreciating Life"],["Animal","Appreciating Life"],
  ["Animal","Accepting Limitations"],["Animal","Accepting Limitations"],["Animal","Accepting Limitations"],
  ["Animal","Appreciating the World"],["Animal","Appreciating the World"],["Animal","Appreciating the World"],
  ["Animal","Perseverance"],["Animal","Perseverance"],
  ["Animal","Whimsy"],
  ["Animal","Bits of Encouragement"],
  ["Text","Appreciating Life"],["Text","Appreciating Life"],["Text","Appreciating Life"],["Text","Appreciating Life"],["Text","Appreciating Life"],
  ["Text","Self-Knowledge"],["Text","Self-Knowledge"],["Text","Self-Knowledge"],
  ["Text","Focus on Yourself"],["Text","Focus on Yourself"],["Text","Focus on Yourself"],["Text","Focus on Yourself"],
  ["Text","Positive Future"],["Text","Positive Future"],["Text","Positive Future"],["Text","Positive Future"],["Text","Positive Future"],
  ["Text","Reframing Negatives"],["Text","Reframing Negatives"],["Text","Reframing Negatives"],["Text","Reframing Negatives"],["Text","Reframing Negatives"],["Text","Reframing Negatives"],
  ["Text","Accepting Limitations"],["Text","Accepting Limitations"],["Text","Accepting Limitations"],
  ["Text","Be Kind"],["Text","Be Kind"],["Text","Be Kind"],
  ["Text","Perseverance"],["Text","Perseverance"],["Text","Perseverance"],
  ["Text","Meta"],["Text","Meta"],
  ["Text","Appreciating the World"],
  ["Text","Bits of Encouragement"],
  ["Text","Whimsy"],
  ["Building","Reframing Negatives"],
  ["Building","Be Kind"],
  ["Building","Appreciating Life"],
  ["Building","Self-Knowledge"],
  ["Building","Accepting Limitations"],
  ["Outer Space","Reframing Negatives"],
  ["Outer Space","Self-Knowledge"],
  ["Outer Space","Positive Future"],
  ["Objects","Meta"],
  ["Automobile","Self-Knowledge"],
  ["Automobile","Appreciating Life"],
  ["Interior","Be Kind"],
];

const nodeCt = {};
RAW.forEach(function(d) {
  nodeCt[d[0]] = (nodeCt[d[0]]||0)+1;
  nodeCt[d[1]] = (nodeCt[d[1]]||0)+1;
});

const cmW = {};
RAW.forEach(function(d) {
  var k = d[0]+'|||'+d[1];
  cmW[k] = (cmW[k]||0)+1;
});

var contentIds = Array.from(new Set(RAW.map(function(d){return d[0]}))).sort();
var messageIds = Array.from(new Set(RAW.map(function(d){return d[1]}))).sort();

var nodes = contentIds.map(function(id) {
  return {id: id, type:'content', count: nodeCt[id]};
}).concat(messageIds.map(function(id) {
  return {id: id, type:'message', count: nodeCt[id]};
}));

var links = Object.entries(cmW).map(function(entry) {
  var parts = entry[0].split('|||');
  return {source: parts[0], target: parts[1], weight: entry[1]};
});

var maxCount = d3.max(nodes, function(d){return d.count});
var rScale   = d3.scaleSqrt().domain([0, maxCount]).range([5, 28]);
var maxW     = d3.max(links, function(d){return d.weight});
var wScale   = d3.scaleLinear().domain([1, maxW]).range([0.6, 7]);

var colX = { content: W*0.2, message: W*0.8 };

var svg = d3.select('#network-svg');
var edgeLayer  = svg.append('g');
var nodeLayer  = svg.append('g');
var labelLayer = svg.append('g');

svg.append('text').attr('class','col-label').attr('x', colX.content).attr('y', 28).attr('text-anchor','middle').text('Content theme');
svg.append('text').attr('class','col-label').attr('x', colX.message).attr('y', 28).attr('text-anchor','middle').text('Message theme');

var sim = d3.forceSimulation(nodes)
  .force('link',    d3.forceLink(links).id(function(d){return d.id}).strength(0.12).distance(130))
  .force('charge',  d3.forceManyBody().strength(-200))
  .force('x',       d3.forceX(function(d){return colX[d.type]}).strength(0.55))
  .force('y',       d3.forceY(H * 0.52).strength(0.05))
  .force('collide', d3.forceCollide(function(d){return rScale(d.count) + 14}));

var edge = edgeLayer.selectAll('line')
  .data(links).join('line')
  .attr('stroke', '#8BA898')
  .attr('stroke-width', function(d){return wScale(d.weight)})
  .attr('opacity', 0.22)
  .attr('stroke-linecap','round');

var circ = nodeLayer.selectAll('circle')
  .data(nodes).join('circle')
  .attr('r', function(d){return rScale(d.count)})
  .attr('fill', function(d){return d.type==='content' ? '#d6b2b7' : '#1A4D3A'})
  .attr('fill-opacity', 0.85)
  .attr('stroke', '#FAF5F0')
  .attr('stroke-width', 2)
  .style('cursor','pointer');

var lbl = labelLayer.selectAll('text')
  .data(nodes).join('text')
  .attr('class','node-label')
  .text(function(d){return d.id})
  .attr('font-size','11');

var infoBar = document.getElementById('info-bar');

circ.on('mouseover', function(ev, d) {
  var typeLabel = d.type==='content' ? 'Content theme' : 'Message theme';
  infoBar.textContent = d.id + '  ·  ' + typeLabel + '  ·  ' + d.count + ' posts';
  var connIds = new Set();
  links.forEach(function(l) {
    if (l.source.id===d.id) connIds.add(l.target.id);
    if (l.target.id===d.id) connIds.add(l.source.id);
  });
  circ.attr('fill-opacity', function(n){return n===d ? 1 : connIds.has(n.id) ? 0.8 : 0.12});
  edge.attr('opacity', function(l){return (l.source.id===d.id || l.target.id===d.id) ? 0.85 : 0.03});
  lbl.attr('fill', function(n){return n===d || connIds.has(n.id) ? '#2A2A28' : '#7A736C'})
     .attr('font-weight', function(n){return n===d ? '500' : '400'});
})
.on('mouseout', function() {
  infoBar.textContent = 'Hover a node to highlight connections · Drag to rearrange';
  circ.attr('fill-opacity', 0.85);
  edge.attr('opacity', 0.22);
  lbl.attr('fill','#7A736C').attr('font-weight','400');
});

circ.call(d3.drag()
  .on('start', function(ev,d) { if(!ev.active) sim.alphaTarget(0.3).restart(); d.fx=d.x; d.fy=d.y; })
  .on('drag',  function(ev,d) { d.fx=ev.x; d.fy=ev.y; })
  .on('end',   function(ev,d) { if(!ev.active) sim.alphaTarget(0); d.fx=null; d.fy=null; })
);

sim.on('tick', function() {
  edge
    .attr('x1', function(d){return d.source.x}).attr('y1', function(d){return d.source.y})
    .attr('x2', function(d){return d.target.x}).attr('y2', function(d){return d.target.y});
  circ.attr('cx', function(d){return d.x}).attr('cy', function(d){return d.y});
  lbl
    .attr('text-anchor', function(d){return d.type==='content' ? 'end' : 'start'})
    .attr('x', function(d){return d.type==='content' ? d.x - rScale(d.count) - 5 : d.x + rScale(d.count) + 5})
    .attr('y', function(d){return d.y + 4});
});
