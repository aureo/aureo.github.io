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
        svg.innerHTML = '';

        function hexagonPoints(x, y, size) {
            var points = [];
            for (var theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
                var pointX, pointY;

                pointX = x + size * Math.sin(theta);
                pointY = y + size * Math.cos(theta);

                points.push(pointX + ',' + pointY);
            }

            return points.join(' ');
        }

        function octogonPoints(x, y, size) {
            var points = [];
            for (var theta = 0; theta < Math.PI * 2; theta += Math.PI / 4) {
                var pointX, pointY;

                pointX = x + size * Math.sin(theta);
                pointY = y + size * Math.cos(theta);

                points.push(pointX + ',' + pointY);
            }

            return points.join(' ');
        }

        function starPoints(x, y, size) {
            var points = [];
            for (var i = 0; i < 16; i++) {
                var pointX, pointY;

                theta = i * Math.PI / 8;
                pointX = x + size * (1 - 0.4*(i%2)) * Math.sin(theta);
                pointY = y + size * (1 - 0.4*(i%2)) * Math.cos(theta);

                points.push(pointX + ',' + pointY);
            }

            return points.join(' ');
        }

        var offset = (Math.sqrt(3) * size) / 2;
        // Generate hex cells (you'll need to add logic for hexagon positioning and shape)
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                //const cell = document.createElement('div');
                //cell.classList.add('hex-cell');

                x = size + offset * col * 2;
                y = size + offset * row * Math.sqrt(3);

                if (row % 2 !== 0) x += offset;

                var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                polygon.classList.add("tile");
                polygon.style.fillOpacity = "0";
                polygon.style.stroke = "rgb(191, 191, 191)";
                polygon.style.strokeWidth = '1px';
                polygon.setAttribute('points', hexagonPoints(x, y, size));
                polygon.setAttribute('row', row);
                polygon.setAttribute('col', col);

                polygon.addEventListener('click', function (event) {
                    const shape = document.getElementById('shapePicker').value;
                    const color = document.getElementById('colorPicker').value;
                    //event.target.style.fill = color;

                    var offset = (Math.sqrt(3) * size) / 2;
                    x = size + offset * col * 2;
                    y = size + offset * row * Math.sqrt(3);
                    if (row % 2 !== 0) x += offset;

                    var id = "e-" + row + "-" + col;
                    var e = document.getElementById(id);
                    if (e != null) e.remove();

                    if (shape == "circle") {
                        var element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                        element.id = id;
                        element.style.fill = color;
                        element.style.stroke = "rgb(0, 0, 0)";
                        element.style.strokeWidth = "1px";
                        element.setAttribute("cx", x);
                        element.setAttribute("cy", y);
                        element.setAttribute("r", size * 0.75);

                        element.addEventListener('click', function(event){}, false)
                        
                        //svg.appendChild(element);
                        svg.insertBefore(element, svg.firstChild);
                    } else if (shape == "octagon") {
                        var element = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                        element.id = id;
                        element.style.fill = color;
                        element.style.stroke = "rgb(0, 0, 0)";
                        element.style.strokeWidth = "1px";
                        element.setAttribute("points", octogonPoints(x, y, size * 0.75));

                        element.addEventListener('click', function(event){}, false)
                        
                        //svg.appendChild(element);
                        svg.insertBefore(element, svg.firstChild);
                    } else if (shape == "star") {
                        var element = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                        element.id = id;
                        element.style.fill = color;
                        element.style.stroke = "rgb(0, 0, 0)";
                        element.style.strokeWidth = "1px";
                        element.setAttribute("points", starPoints(x, y, size));

                        element.addEventListener('click', function(event){}, false)
                        
                        //svg.appendChild(element);
                        svg.insertBefore(element, svg.firstChild);
                    }
                }, false);

                svg.appendChild(polygon);
            }
        }
    }

    // Initial creation of the grid
    createHexGrid();

    // Recreate the grid when input values change
    document.getElementById('hexSize').addEventListener('change', createHexGrid);
    document.getElementById('rows').addEventListener('change', createHexGrid);
    document.getElementById('columns').addEventListener('change', createHexGrid);
    document.getElementById("showGrid").addEventListener("change", function(event) {
        for (tile of document.getElementById('svg').getElementsByClassName("tile")) {
            if (event.target.checked) tile.style.opacity = "1"
            else tile.style.opacity = "0"
        }
    }, false);
});
