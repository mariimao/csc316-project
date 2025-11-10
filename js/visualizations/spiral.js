// Spiral visualization moved from spiral.html
(function(){
    // Sample data: genres/keywords over time
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

    // Genre color mapping
    const genreColors = {
        'Drama': '#8B0000',
        'Romance': '#DC143C',
        'Action': '#000000',
        'Comedy': '#FF8C00',
        'Thriller': '#800080',
        'Sci-Fi': '#00CED1',
        'Horror': '#8B008B',
        'Documentary': '#2E8B57'
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
    const height = width; // Maintain square aspect ratio
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

    // Spiral parameters - responsive sizing
    const numCoils = 3;
    const maxRadius = Math.min(300, width * 0.375); // Scale with container
    const segments = timelineData.length;

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

        // Responsive stroke width
        const baseStrokeWidth = Math.max(15, Math.min(20, width / 40));
        
        const path = spiralGroup.append('path')
            .datum(points)
            .attr('class', 'spiral-path')
            .attr('d', lineGenerator)
            .attr('stroke', genreColors[d.genre])
            .attr('stroke-width', 0)
            .attr('opacity', 0.85)
            .attr('data-base-width', baseStrokeWidth)
            .on('mouseover', function(event) {
                d3.select(this).attr('opacity', 1);
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
                d3.select(this).attr('opacity', 0.85);
                tooltip.style('opacity', 0);
            });

        // Add genre label
        const midPoint = spiralPoint((t0 + t1) / 2, startRadius, maxRadius);
        const labelAngle = midPoint.angle + Math.PI / 2;

        g.append('text')
            .attr('class', 'genre-label')
            .attr('x', midPoint.x)
            .attr('y', midPoint.y)
            .attr('transform', `rotate(${labelAngle * 180 / Math.PI}, ${midPoint.x}, ${midPoint.y})`)
            .attr('fill', genreColors[d.genre])
            .attr('opacity', 0)
            .text(d.genre);

        // Add keyword label (smaller, inside)
        const keywordPoint = spiralPoint((t0 + t1) / 2, startRadius - 10, maxRadius - 20);
        g.append('text')
            .attr('class', 'time-label')
            .attr('x', keywordPoint.x)
            .attr('y', keywordPoint.y)
            .attr('opacity', 0)
            .text(d.keyword);
    });

    // Center labels
    g.append('text')
        .attr('class', 'center-label')
        .attr('y', -5)
        .text('2024');

    g.append('text')
        .attr('class', 'time-label')
        .attr('y', 15)
        .text('Timeline');

    // Create legend
    const legend = d3.select('#legend');
    Object.entries(genreColors).forEach(([genre, color]) => {
        const item = legend.append('div').attr('class', 'legend-item');
        item.append('div')
            .attr('class', 'legend-color')
            .style('background-color', color);
        item.append('span').text(genre);
    });

    // Animation function
    function animateSpiral() {
        // Animate stroke width - use responsive width
        const baseStrokeWidth = Math.max(15, Math.min(20, width / 40));
        svg.selectAll('.spiral-path')
            .transition()
            .duration(300)
            .delay((d, i) => i * 100)
            .attr('stroke-width', baseStrokeWidth);

        // Animate labels
        svg.selectAll('.genre-label, .time-label')
            .transition()
            .duration(300)
            .delay((d, i) => i * 100)
            .attr('opacity', 1);
    }

    // Reset function
    function resetSpiral() {
        svg.selectAll('.spiral-path')
            .transition()
            .duration(300)
            .attr('stroke-width', 0);

        svg.selectAll('.genre-label, .time-label')
            .transition()
            .duration(300)
            .attr('opacity', 0);
    }

    // Expose control functions for inline buttons
    window.animateSpiral = animateSpiral;
    window.resetSpiral = resetSpiral;

    // Auto-animate on load
    setTimeout(animateSpiral, 500);

})();
