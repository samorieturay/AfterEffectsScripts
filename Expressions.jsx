{
    // Create UI panel
    var win = new Window("palette", "Expression Scripts", undefined, {resizeable: true});
    win.orientation = "column";

    // Bounce Expression Button
    var bounceBtn = win.add("button", undefined, "Bounce Expression");
    bounceBtn.onClick = function() {
        applyExpression("bounce");
    };

    // Inertia Expression Button
    var inertiaBtn = win.add("button", undefined, "Inertia Expression");
    inertiaBtn.onClick = function() {
        applyExpression("inertia");
    };

    // Random Expression Button
    var randomBtn = win.add("button", undefined, "Random Expression");
    randomBtn.onClick = function() {
        applyExpression("random");
    };

    // Time * 800 Expression Button
    var timeBtn = win.add("button", undefined, "Time * 800 Expression");
    timeBtn.onClick = function() {
        applyExpression("time800");
    };

    // Wiggle Expression Button
    var wiggleBtn = win.add("button", undefined, "Wiggle (4, 10) Expression");
    wiggleBtn.onClick = function() {
        applyExpression("wiggle");
    };

    win.center();
    win.show();

    function applyExpression(expressionType) {
        var comp = app.project.activeItem;
        if (comp && comp instanceof CompItem) {
            var layers = comp.selectedLayers;
            if (layers.length > 0) {
                app.beginUndoGroup("Apply Expression");

                for (var i = 0; i < layers.length; i++) {
                    var layer = layers[i];
                    var property = layer.selectedProperties[0];
                    if (property && (property.canSetExpression)) {
                        switch (expressionType) {
                            case "bounce":
                                property.expression = getBounceExpression();
                                break;
                            case "inertia":
                                property.expression = getInertiaExpression();
                                break;
                            case "random":
                                property.expression = getRandomExpression();
                                break;
                            case "time800":
                                property.expression = getTime800Expression();
                                break;
                            case "wiggle":
                                property.expression = getWiggleExpression();
                                break;
                        }
                    }
                }

                app.endUndoGroup();
            } else {
                alert("Please select at least one layer.");
            }
        } else {
            alert("Please select a composition.");
        }
    }

    function getBounceExpression() {
        return "amp = .1;\n" +
               "freq = 2.0;\n" +
               "decay = 2.0;\n" +
               "n = 0;\n" +
               "time_max = 4;\n" +
               "if (numKeys > 0){\n" +
               "  n = nearestKey(time).index;\n" +
               "  if (key(n).time > time){\n" +
               "    n--;\n" +
               "  }\n" +
               "}\n" +
               "if (n == 0){ t = 0;\n" +
               "}else{\n" +
               "  t = time - key(n).time;\n" +
               "}\n" +
               "if (n > 0 && t < time_max){\n" +
               "  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);\n" +
               "  value + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);\n" +
               "}else{value}";
    }

    function getInertiaExpression() {
        return "e = .7;\n" +
               "g = 5000;\n" +
               "nMax = 9;\n" +
               "\n" +
               "n = 0;\n" +
               "if (numKeys > 0){\n" +
               "  n = nearestKey(time).index;\n" +
               "  if (key(n).time > time) n--;\n" +
               "}\n" +
               "if (n > 0){\n" +
               "  t = time - key(n).time;\n" +
               "  v = -velocityAtTime(key(n).time - .001)*e;\n" +
               "  vl = length(v);\n" +
               "  if (value instanceof Array){\n" +
               "    vu = (vl > 0) ? normalize(v) : [0,0,0];\n" +
               "  }else{\n" +
               "    vu = (v < 0) ? -1 : 1;\n" +
               "  }\n" +
               "  tCur = 0;\n" +
               "  segDur = 2*vl/g;\n" +
               "  tNext = segDur;\n" +
               "  nb = 1; // number of bounces\n" +
               "  while (tNext < t && nb <= nMax){\n" +
               "    vl *= e;\n" +
               "    segDur *= e;\n" +
               "    tCur = tNext;\n" +
               "    tNext += segDur;\n" +
               "    nb++\n" +
               "  }\n" +
               "  if(nb <= nMax){\n" +
               "    delta = t - tCur;\n" +
               "    value +  vu*delta*(vl - g*delta/2);\n" +
               "  }else{\n" +
               "    value\n" +
               "  }\n" +
               "}else\n" +
               "  value";
    }

    function getRandomExpression() {
        return "seedRandom(index, true);\n" +
               "wiggle(5, 20);";
    }

    function getTime800Expression() {
        return "time * 800;";
    }

    function getWiggleExpression() {
        return "wiggle(4, 10);";
    }
}
