(function(){
    const timelineData = [
        { time: 'Jan', genre: 'Drama', keyword: 'family', popularity: 85 },
        { time: 'Feb', genre: 'Romance', keyword: 'love', popularity: 78 },
        { time: 'Mar', genre: 'Action', keyword: 'adventure', popularity: 82 },
        { time: 'Apr', genre: 'Comedy', keyword: 'friendship', popularity: 75 },
        { time: 'May', genre: 'Thriller', keyword: 'mystery', popularity: 88 },
        { time: 'Jun', genre: 'Sci-Fi', keyword: 'future', popularity: 70 },
        { time: 'Jul', genre: 'Horror', keyword: 'suspense', popularity: 80 },
        { time: 'Aug', genre: 'Documentary', keyword: 'truth', popularity: 65 },
        { time: 'Sep', genre: 'Action', keyword: 'hero', popularity: 90 },
        { time: 'Oct', genre: 'Horror', keyword: 'fear', popularity: 92 },
        { time: 'Nov', genre: 'Drama', keyword: 'emotion', popularity: 87 },
        { time: 'Dec', genre: 'Romance', keyword: 'holiday', popularity: 95 }
    ];

    // FALL NEUTRAL PASTEL COLORS - no pink!
    const genreColors = {
        'Drama': '#D4A574',        // Warm tan
        'Romance': '#C9A66B',      // Muted gold
        'Action': '#8B9E83',       // Sage green
        'Comedy': '#E8C170',       // Soft mustard
        'Thriller': '#9B8B7E',     // Taupe
        'Sci-Fi': '#7B9EA8',       // Dusty blue
        'Horror': '#A77B5B',       // Terracotta
        'Documentary': '#8FA888'   // Olive green
    };

    // Setup SVG - responsive sizing
    const svg = d3.select('#spiral-viz');
    if (svg.empty()) {
        console.warn('Spiral visualization container not found');
        return;
    }

    // Get container or parent dimensions
    const container = svg.node().parentElement || svg.node();
    let containerWidth = 800;

    if (container && container.clientWidth) {
        containerWidth = Math.min(container.clientWidth, 800);
    } else if (window.innerWidth) {
        containerWidth = Math.min(window.innerWidth - 40, 800);
    }

    // Ensure minimum size
    containerWidth = Math.max(300, containerWidth);
    const width = containerWidth;
    const height = width;
    const centerX = width / 2;
    const centerY = height / 2;

    // Set SVG attributes for responsiveness
    svg.attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .style('max-width', '800px')
        .style('max-height', '800px')
        .style('min-width', '300px')
        .style('min-height', '300px');

    const g = svg.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`);

    // Tooltip
    const tooltip = d3.select('#tooltip');

    // Spiral parameters
    const numCoils = 3;
    const maxRadius = Math.min(300, width * 0.375);
    const segments = timelineData.length;
    const baseStrokeWidth = Math.max(15, Math.min(20, width / 40));

    // Generate spiral points
    function spiralPoint(t, startRadius, endRadius) {
        const angle = t * numCoils * 2 * Math.PI;
        const radius = startRadius + (endRadius - startRadius) * t;
        return {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
            angle: angle
        };
    }

    // Create spiral segments
    const spiralGroup = g.append('g').attr('class', 'spiral-group');
    const labelsGroup = g.append('g').attr('class', 'labels-group');

    timelineData.forEach((d, i) => {
        const t0 = i / segments;
        const t1 = (i + 1) / segments;
        const startRadius = 30;

        // Generate path points
        const points = [];
        const resolution = 20;
        for (let j = 0; j <= resolution; j++) {
            const t = t0 + (t1 - t0) * (j / resolution);
            points.push(spiralPoint(t, startRadius, maxRadius));
        }

        // Create path
        const lineGenerator = d3.line()
            .x(p => p.x)
            .y(p => p.y)
            .curve(d3.curveCardinal);

        const pathString = lineGenerator(points);
        const path = spiralGroup.append('path')
            .datum(points)
            .attr('class', 'spiral-path')
            .attr('d', pathString)
            .attr('stroke', genreColors[d.genre])
            .attr('stroke-width', baseStrokeWidth)
            .attr('fill', 'none')
            .attr('opacity', 0)  // Start invisible
            .attr('stroke-dasharray', function() {
                return this.getTotalLength();
            })
            .attr('stroke-dashoffset', function() {
                return this.getTotalLength();
            })
            .on('mouseover', function(event) {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr('stroke-width', baseStrokeWidth * 1.3)
                    .attr('opacity', 1);

                tooltip
                    .style('opacity', 1)
                    .html(`
                        <strong>${d.time}</strong><br>
                        Genre: ${d.genre}<br>
                        Keyword: ${d.keyword}<br>
                        Popularity: ${d.popularity}%
                    `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr('stroke-width', baseStrokeWidth)
                    .attr('opacity', 0.85);
                tooltip.style('opacity', 0);
            });

        // Add genre label - BIGGER with pixel font
        const midPoint = spiralPoint((t0 + t1) / 2, startRadius, maxRadius);
        const labelAngle = midPoint.angle + Math.PI / 2;

        labelsGroup.append('text')
            .attr('class', 'genre-label')
            .attr('x', midPoint.x)
            .attr('y', midPoint.y)
            .attr('transform', `rotate(${labelAngle * 180 / Math.PI}, ${midPoint.x}, ${midPoint.y})`)
            .attr('fill', genreColors[d.genre])
            .attr('opacity', 0)
            .style('font-family', '"Press Start 2P", "Courier New", monospace')
            .style('font-size', '14px')
            .style('font-weight', 'normal')
            .style('text-shadow', '2px 2px 0 rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)')
            .text(d.genre);

        const keywordPoint = spiralPoint((t0 + t1) / 2, startRadius - 10, maxRadius - 20);
        labelsGroup.append('text')
            .attr('class', 'time-label')
            .attr('x', keywordPoint.x)
            .attr('y', keywordPoint.y)
            .attr('fill', '#D4C5B0')
            .attr('opacity', 0)
            .style('font-family', '"Press Start 2P", "Courier New", monospace')
            .style('font-size', '11px')
            .style('text-shadow', '2px 2px 0 rgba(0,0,0,0.8)')
            .text(d.keyword);
    });

    // Center labels - BIGGER with pixel font
    g.append('text')
        .attr('class', 'center-label')
        .attr('y', -5)
        .attr('fill', '#E8C170')
        .style('font-family', '"Press Start 2P", "Courier New", monospace')
        .style('font-size', '28px')
        .style('text-shadow', '3px 3px 0 rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.6)')
        .text('2024');

    g.append('text')
        .attr('class', 'time-label')
        .attr('y', 25)
        .attr('fill', '#D4C5B0')  // Light beige
        .style('font-family', '"Press Start 2P", "Courier New", monospace')
        .style('font-size', '12px')
        .style('text-shadow', '2px 2px 0 rgba(0,0,0,0.8)')
        .text('Timeline');

    // Create legend with fall neutral colors
    const legend = d3.select('#legend');
    legend.selectAll('*').remove(); // Clear existing
    Object.entries(genreColors).forEach(([genre, color]) => {
        const item = legend.append('div').attr('class', 'legend-item');
        item.append('div')
            .attr('class', 'legend-color')
            .style('background-color', color);
        item.append('span')
            .style('color', '#D4C5B0')
            .style('font-family', '"Press Start 2P", "Courier New", monospace')
            .style('font-size', '11px')
            .text(genre);
    });

    // ANIMATION FUNCTION - draws the spiral in
    function animateSpiral() {
        console.log('🎬 ANIMATE CALLED!');

        // Animate paths drawing in with stroke-dashoffset
        svg.selectAll('.spiral-path')
            .transition()
            .duration(800)
            .delay((d, i) => i * 80)
            .attr('opacity', 0.85)
            .attr('stroke-dashoffset', 0)
            .ease(d3.easeCubicOut);

        // Fade in labels after paths start drawing
        svg.selectAll('.genre-label, .time-label')
            .transition()
            .duration(500)
            .delay((d, i) => i * 80 + 300)
            .attr('opacity', 1);
    }

    // RESET FUNCTION - hides everything
    function resetSpiral() {
        console.log('⏹ RESET CALLED!');

        svg.selectAll('.spiral-path')
            .transition()
            .duration(400)
            .attr('opacity', 0)
            .attr('stroke-dashoffset', function() {
                return this.getTotalLength();
            });

        svg.selectAll('.genre-label, .time-label')
            .transition()
            .duration(300)
            .attr('opacity', 0);
    }

    // Expose functions globally
    window.animateSpiral = animateSpiral;
    window.resetSpiral = resetSpiral;

    // Debug logs
    console.log('✓ Spiral.js loaded with pastel colors');
    console.log('✓ SVG found:', !svg.empty());
    console.log('✓ Data points:', timelineData.length);

    // Auto-animate on load
    setTimeout(function() {
        console.log('⏱ Auto-animation starting...');
        animateSpiral();
    }, 800);

})();