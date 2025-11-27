// Popcorn Kernel Burst Visualization
(function() {
    const svg = d3.select('#popcorn-stage');
    const tooltip = d3.select('#tooltip');
    const width = 1200;
    const height = 600;
    const floorY = height - 100;

    // Popcorn bucket dimensions
    const bucketCenterX = width / 2;
    const bucketBottomY = floorY + 20;
    const bucketWidth = 180;
    const bucketHeight = 140;
    const bucketTopWidth = 220;

    // Calculate positions - kernels start from bucket
    const spacing = (width - 200) / GENRE_DATA.length;
    const kernelData = GENRE_DATA.map((d, i) => ({
        ...d,
        startX: bucketCenterX + (Math.random() - 0.5) * 60, // Random position in bucket
        startY: bucketBottomY - 40, // Inside bucket
        x: 100 + spacing * i + spacing / 2,
        popY: floorY - (d.popularity / 100) * ANIMATION_CONFIG.maxPopHeight,
        isPopped: false
    }));

    // Draw floor line
    svg.append('line')
        .attr('class', 'floor-line')
        .attr('x1', 50)
        .attr('y1', floorY)
        .attr('x2', width - 50)
        .attr('y2', floorY);

    // Draw popcorn bucket BEFORE kernels (so kernels appear on top)
    const bucketGroup = svg.append('g').attr('class', 'popcorn-bucket');

    // Create striped pattern for bucket
    const defs = svg.append('defs');
    const pattern = defs.append('pattern')
        .attr('id', 'stripes')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 20)
        .attr('height', 20)
        .attr('patternTransform', 'rotate(0)');

    pattern.append('rect')
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', '#ffffff');

    pattern.append('rect')
        .attr('x', 0)
        .attr('width', 10)
        .attr('height', 20)
        .attr('fill', '#e74c3c');

    // Bucket body (trapezoid shape)
    const bucketPath = `
        M ${bucketCenterX - bucketWidth/2} ${bucketBottomY}
        L ${bucketCenterX - bucketTopWidth/2} ${bucketBottomY - bucketHeight}
        L ${bucketCenterX + bucketTopWidth/2} ${bucketBottomY - bucketHeight}
        L ${bucketCenterX + bucketWidth/2} ${bucketBottomY}
        Z
    `;

    bucketGroup.append('path')
        .attr('d', bucketPath)
        .attr('fill', 'url(#stripes)')
        .attr('stroke', '#c0392b')
        .attr('stroke-width', 4);

    // Bucket rim (top edge)
    bucketGroup.append('line')
        .attr('x1', bucketCenterX - bucketTopWidth/2)
        .attr('y1', bucketBottomY - bucketHeight)
        .attr('x2', bucketCenterX + bucketTopWidth/2)
        .attr('y2', bucketBottomY - bucketHeight)
        .attr('stroke', '#c0392b')
        .attr('stroke-width', 6)
        .attr('stroke-linecap', 'round');

    // Bucket bottom shadow
    bucketGroup.append('ellipse')
        .attr('cx', bucketCenterX)
        .attr('cy', bucketBottomY + 5)
        .attr('rx', bucketWidth/2)
        .attr('ry', 10)
        .attr('fill', 'rgba(0,0,0,0.3)');

    // "POPCORN" text on bucket
    bucketGroup.append('text')
        .attr('x', bucketCenterX)
        .attr('y', bucketBottomY - bucketHeight/2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .attr('font-size', '14px')
        .attr('font-family', '"Press Start 2P", monospace')
        .attr('paint-order', 'stroke')
        .attr('stroke', '#c0392b')
        .attr('stroke-width', 3)
        .text('POPCORN');

    // Draw popularity scale bars (background)
    const scaleGroup = svg.append('g').attr('class', 'scale-bars');
    for (let i = 0; i <= 100; i += 20) {
        const y = floorY - (i / 100) * ANIMATION_CONFIG.maxPopHeight;
        scaleGroup.append('line')
            .attr('class', 'popularity-bar')
            .attr('x1', 50)
            .attr('y1', y)
            .attr('x2', width - 50)
            .attr('y2', y)
            .attr('stroke', '#333')
            .attr('stroke-width', 1);

        scaleGroup.append('text')
            .attr('x', 30)
            .attr('y', y + 5)
            .attr('fill', '#666')
            .attr('font-size', '10px')
            .text(`${i}%`);
    }

    // Y-axis label
    const yLabelY = floorY - ANIMATION_CONFIG.maxPopHeight / 2;
    svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('x', 20)
        .attr('y', yLabelY)
        .attr('fill', '#D4C5B0')
        .attr('font-size', '12px')
        .attr('text-anchor', 'middle')
        .attr('transform', `rotate(-90 20 ${yLabelY})`)
        .text('Popularity');

    // Create kernels group (above bucket)
    const kernelsGroup = svg.append('g').attr('class', 'kernels');

    // Draw kernels starting IN the bucket
    kernelData.forEach((d, i) => {
        const kernelGroup = kernelsGroup.append('g')
            .attr('class', 'kernel')
            .attr('data-index', i)
            .attr('transform', `translate(${d.startX}, ${d.startY})`);

        // Unpopped kernel (small brown ellipse)
        const unpoppedGroup = kernelGroup.append('g')
            .attr('class', 'unpopped');

        unpoppedGroup.append('ellipse')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('rx', ANIMATION_CONFIG.kernelSize)
            .attr('ry', ANIMATION_CONFIG.kernelSize * 0.8)
            .attr('fill', '#4a3520')
            .attr('stroke', '#2a1510')
            .attr('stroke-width', 2);

        // Popped corn (fluffy cloud shape) - hidden initially
        const poppedGroup = kernelGroup.append('g')
            .attr('class', 'popped-corn')
            .style('opacity', 0);

        // Create fluffy popcorn shape with multiple circles
        const puffSizes = [20, 18, 16, 18, 15];
        const puffOffsets = [
            {x: 0, y: -5},
            {x: -10, y: 5},
            {x: 10, y: 5},
            {x: -5, y: 10},
            {x: 5, y: 10}
        ];

        puffOffsets.forEach((offset, idx) => {
            poppedGroup.append('circle')
                .attr('cx', offset.x)
                .attr('cy', offset.y)
                .attr('r', puffSizes[idx])
                .attr('fill', GENRE_COLORS[d.genre])
                .attr('stroke', '#fff')
                .attr('stroke-width', 2)
                .style('filter', `drop-shadow(0 2px 4px rgba(0,0,0,0.3))`);
        });

        // Genre label
        kernelGroup.append('text')
            .attr('class', 'kernel-label')
            .attr('x', 0)
            .attr('y', 50)
            .attr('fill', GENRE_COLORS[d.genre])
            .style('opacity', 0)
            .text(d.genre);

        // Popularity text
        kernelGroup.append('text')
            .attr('class', 'kernel-label')
            .attr('x', 0)
            .attr('y', 70)
            .attr('fill', '#D4C5B0')
            .attr('font-size', '9px')
            .style('opacity', 0)
            .text(`${d.popularity}%`);

        // Click to pop individual kernel and show fortune cookie
        kernelGroup
            .style('cursor', 'pointer')
            .on('click', function(event) {
                event.stopPropagation();
                if (d.isPopped) {
                    // If already popped, show fortune cookie in center
                    showFortuneCookieModal(d.genre);
                } else {
                    // First pop the kernel
                    popSingleKernel(i);
                }
            })
            .on('mouseover', function(event) {
                const message = d.isPopped
                    ? `<strong>${d.genre}</strong><br>Popularity: ${d.popularity}%<br>Shows: ${d.shows}<br>Avg Rating: ${d.avgRating}<br><br><em>Click for movie!</em>`
                    : `<strong>${d.genre}</strong><br>Popularity: ${d.popularity}%<br>Shows: ${d.shows}<br>Avg Rating: ${d.avgRating}`;

                tooltip
                    .style('opacity', 1)
                    .html(message)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                tooltip.style('opacity', 0);
            });
    });

    // Show fortune cookie modal in center of screen
    function showFortuneCookieModal(genre) {
        console.log(' Showing fortune cookie for:', genre);

        // Get random movie recommendation
        const movies = MOVIE_RECOMMENDATIONS[genre];
        const movie = movies[Math.floor(Math.random() * movies.length)];

        console.log('Selected movie:', movie); // Debug log

        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'fortune-modal';

        // Create fortune content
        modal.innerHTML = `
        <div class="fortune-content">
            <div class="cookie-half cookie-left" style="background-color: ${GENRE_COLORS[genre]}; border: 3px solid #8B7355;"></div>
            <div class="cookie-half cookie-right" style="background-color: ${GENRE_COLORS[genre]}; border: 3px solid #8B7355;"></div>
            <div class="fortune-slip">
                <h2>${movie.title}</h2>
                <div class="year">(${movie.year})</div>
                <div class="tagline">"${movie.tagline}"</div>
                <div class="icon">🎬</div>
            </div>
        </div>
    `;

        document.body.appendChild(modal);

        // Trigger animations
        setTimeout(() => {
            modal.classList.add('visible');

            setTimeout(() => {
                modal.querySelector('.cookie-left').classList.add('cracked-left');
                modal.querySelector('.cookie-right').classList.add('cracked-right');

                setTimeout(() => {
                    modal.querySelector('.fortune-slip').classList.add('visible');
                }, 500);
            }, 100);
        }, 10);

        // Close on click
        modal.addEventListener('click', function() {
            modal.classList.remove('visible');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.classList.remove('visible');
                setTimeout(() => {
                    if (document.body.contains(modal)) {
                        document.body.removeChild(modal);
                    }
                }, 300);
            }
        }, 5000);
    }
    // Pop single kernel - now pops OUT of bucket then moves to position
    function popSingleKernel(index) {
        const d = kernelData[index];
        if (d.isPopped) return;

        d.isPopped = true;
        const kernel = svg.select(`[data-index="${index}"]`);

        // Stage 1: Pop up out of bucket with arc motion
        kernel.transition()
            .duration(ANIMATION_CONFIG.popDuration / 2)
            .attr('transform', `translate(${d.x}, ${d.startY - 100})`)
            .ease(d3.easeQuadOut)
            .on('end', function() {
                // Stage 2: Move to final position
                kernel.transition()
                    .duration(ANIMATION_CONFIG.popDuration / 2)
                    .attr('transform', `translate(${d.x}, ${d.popY})`)
                    .ease(d3.easeBounceOut);
            });

        // Hide unpopped, show popped
        kernel.select('.unpopped')
            .transition()
            .duration(200)
            .style('opacity', 0);

        kernel.select('.popped-corn')
            .transition()
            .delay(200)
            .duration(400)
            .style('opacity', 1);

        // Show labels
        kernel.selectAll('.kernel-label')
            .transition()
            .delay(ANIMATION_CONFIG.popDuration)
            .duration(400)
            .style('opacity', 1);
    }

    // Pop all kernels in sequence
    function popAllSequence() {
        console.log('🍿 Popping all kernels...');

        kernelData.forEach((d, i) => {
            setTimeout(() => {
                popSingleKernel(i);
            }, i * ANIMATION_CONFIG.popDelay);
        });
    }

    // Pop all at once
    function popPopcorn() {
        console.log('🍿 Pop!');
        kernelData.forEach((d, i) => {
            popSingleKernel(i);
        });
    }

    // Reset all kernels - return to bucket
    function resetPopcorn() {
        console.log('↺ Resetting popcorn...');

        kernelData.forEach(d => d.isPopped = false);

        svg.selectAll('.kernel').each(function(d, i) {
            const kernel = d3.select(this);
            const data = kernelData[i];

            kernel.transition()
                .duration(500)
                .attr('transform', `translate(${data.startX}, ${data.startY})`);

            kernel.select('.unpopped')
                .transition()
                .duration(500)
                .style('opacity', 1);

            kernel.select('.popped-corn')
                .transition()
                .duration(300)
                .style('opacity', 0);

            kernel.selectAll('.kernel-label')
                .transition()
                .duration(300)
                .style('opacity', 0);
        });
    }

    // Create legend
    const legend = d3.select('#legend');
    Object.entries(GENRE_COLORS).forEach(([genre, color]) => {
        const item = legend.append('div').attr('class', 'legend-item');
        item.append('div')
            .attr('class', 'legend-color')
            .style('background-color', color);
        item.append('span').text(genre);
    });

    // Expose functions globally
    window.popPopcorn = popPopcorn;
    window.resetPopcorn = resetPopcorn;
    window.popAllSequence = popAllSequence;

    console.log('✓ Popcorn Kernel Burst loaded');

// Auto-pop when page becomes visible
    function initPopcornWhenVisible() {
        const popcornPage = document.querySelector('#popcorn-stage').closest('.page');
        if (!popcornPage) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    setTimeout(popAllSequence, 500);
                    observer.disconnect(); // Only trigger once
                }
            });
        }, { threshold: 0.5 });

        observer.observe(popcornPage);
    }

// Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPopcornWhenVisible);
    } else {
        initPopcornWhenVisible();
    }
})();