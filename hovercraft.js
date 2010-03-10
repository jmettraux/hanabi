/*
 * Copyright (c) 2010, John Mettraux, jmettraux@gmail.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Made in Japan.
 */

var Hovercraft = function () {

  var INC = 0.1;
  var MILLISEC = 500;

  function clear (canvasId) {

    var c = document.getElementById(canvasId);
    var context = c.getContext('2d');

    context.clearRect(0, 0, c.width, c.height);
  }

  function draw (canvasId, x, y, zoom, r) {

    clear(canvasId);

    var c = document.getElementById(canvasId);
    var context = c.getContext('2d');

    var nw = c._hover.image.width * zoom;
    var nh = c._hover.image.height * zoom;
    var nx = x * zoom;
    var ny = y * zoom;

    context.save();

    context.translate(c.width / 2, c.height / 2);
    context.rotate(r);

    context.drawImage(c._hover.image, -nx, -ny, nw, nh);

    context.restore();
  }

  function step (canvasId, a, b, progress) {

    setTimeout(
      function () {
        var tx = a.x + (b.x - a.x) * progress;
        var ty = a.y + (b.y - a.y) * progress;
        var tz = a.zoom + (b.zoom - a.zoom) * progress;
        var tr = a.r + (b.r - a.r) * progress;
        draw(canvasId, tx, ty, tz, tr);
      },
      MILLISEC * progress);
  }

  function next (canvasId) {

    var c = document.getElementById(canvasId);

    var a = c._hover.points[c._hover.position] || c._hover.points[0];

    c._hover.position += 1;
    if (c._hover.position >= c._hover.points.length) c._hover.position = 0;

    var b = c._hover.points[c._hover.position];

    for (var i = INC; i <= 1.0; i = i + INC) {
      Hovercraft.step(canvasId, a, b, i);
    }
  }

  function init (canvasId, imageSource, points) {

    var canvas = document.getElementById(canvasId);
    canvas._hover = {};
    canvas._hover.image = new Image();
    //canvas._hover_image.onload = function () {};
    canvas._hover.image.src = imageSource;
    canvas._hover.points = points;

    canvas._hover.position = -1;

    canvas.onclick = function () { Hovercraft.next(canvasId); };
  };

  return {
    init: init,
    next: next,
    step: step,
    clear: clear,
  };
}();

