// script.js
document.addEventListener('DOMContentLoaded', function() {
    const hexGrid = document.getElementById('hexGrid');

    // Function to create the hex grid based on input values
    function createHexGrid() {
        // Clear existing grid
        //hexGrid.innerHTML = '';
        
        // Retrieve user inputs for size, rows, and columns
        const size = 1*document.getElementById('hexSize').value;
        const rows = document.getElementById('rows').value;
        const columns = document.getElementById('columns').value;

        svg = document.getElementById('svg');

        function hexPoints(x, y, size) {
            var points = [];
            for (var theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
                var pointX, pointY;

                pointX = x + size * Math.sin(theta);
                pointY = y + size * Math.cos(theta);

                points.push(pointX + ',' + pointY);
            }

            return points.join(' ');
        }

        var offset = (Math.sqrt(3) * size) / 2;
        // Generate hex cells (you'll need to add logic for hexagon positioning and shape)
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const cell = document.createElement('div');
                cell.classList.add('hex-cell');
                // Additional logic for positioning and sizing based on 'size'
                x = size + offset * col * 2;
                y = size + offset * row * Math.sqrt(3);

                if (row % 2 !== 0) x += offset;

                var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                polygon.style.fill = 'white';
                polygon.style.stroke = "rgb(191, 191, 191)";
                polygon.style.strokeWidth = '1px';
                polygon.setAttribute('points', hexPoints(x, y, size));

                polygon.addEventListener('click', function (event) {
                    event.target.style.boxShadow = '0 0 5px blue inset';
                }, false);

                svg.appendChild(polygon);
            }
        }
    }

    // Event listener for hex cell click
    hexGrid.addEventListener('click', function(event) {
        if (event.target.classList.contains('hex-cell')) {
            const shape = document.getElementById('shapePicker').value;
            const color = document.getElementById('colorPicker').value;
            
            // Add logic to draw, replace, or remove the shape based on the conditions
            // You'll likely need to store some data on the cell to track its state
            
        }
    });

    // Initial creation of the grid
    createHexGrid();

    // Recreate the grid when input values change
    document.getElementById('hexSize').addEventListener('change', createHexGrid);
    document.getElementById('rows').addEventListener('change', createHexGrid);
    document.getElementById('columns').addEventListener('change', createHexGrid);
});
