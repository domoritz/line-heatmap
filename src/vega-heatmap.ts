import embed from "vega-embed";
import { CHART_WIDTH, CHART_HEIGHT } from "./constants";

export default function(heatmapData, binConfigX, binConfigY) {
  console.log(heatmapData, binConfigX, binConfigY);

  embed(
    document.getElementById("heat"),
    {
      $schema: "https://vega.github.io/schema/vega/v4.json",
      width: CHART_WIDTH,
      height: CHART_HEIGHT,
      padding: 5,

      title: {
        text: "Line Heatmap",
        anchor: "middle",
        fontSize: 16,
        frame: "group",
        offset: 4
      },

      signals: [
        { name: "binX", update: JSON.stringify(binConfigX) },
        { name: "binY", update: JSON.stringify(binConfigY) },
        {
          name: "palette",
          value: "Viridis",
          bind: {
            input: "select",
            options: [
              "Viridis",
              "Magma",
              "Inferno",
              "Plasma",
              "Blues",
              "Greens",
              "Greys",
              "Purples",
              "Reds",
              "Oranges",
              "BlueOrange",
              "BrownBlueGreen",
              "PurpleGreen",
              "PinkYellowGreen",
              "PurpleOrange",
              "RedBlue",
              "RedGrey",
              "RedYellowBlue",
              "RedYellowGreen",
              "BlueGreen",
              "BluePurple",
              "GreenBlue",
              "OrangeRed",
              "PurpleBlueGreen",
              "PurpleBlue",
              "PurpleRed",
              "RedPurple",
              "YellowGreenBlue",
              "YellowGreen",
              "YellowOrangeBrown",
              "YellowOrangeRed"
            ]
          }
        },
        {
          name: "reverse",
          value: false,
          bind: { input: "checkbox" }
        }
      ],

      data: [
        {
          name: "table",
          values: heatmapData
        }
      ],

      scales: [
        {
          name: "x",
          type: "bin-linear",
          domain: {
            signal: "sequence(binX.start, binX.stop + binX.step, binX.step)"
          },
          range: "width"
        },
        {
          name: "y",
          type: "bin-linear",
          domain: {
            signal: "sequence(binY.start, binY.stop + binY.step, binY.step)"
          },
          range: "height",
          reverse: true
        },
        {
          name: "color",
          type: "sequential",
          range: { scheme: { signal: "palette" } },
          domain: { data: "table", field: "value" },
          reverse: { signal: "reverse" },
          zero: false,
          nice: true
        }
      ],

      axes: [
        {
          orient: "bottom",
          scale: "x",
          domain: false,
          title: "Time",
          labelOverlap: true
        },
        { orient: "left", scale: "y", domain: false, title: "Value" }
      ],

      legends: [
        {
          fill: "color",
          type: "gradient",
          title: "Density",
          titleFontSize: 12,
          gradientLength: { signal: "height - 16" }
        }
      ],

      marks: [
        {
          type: "rect",
          from: { data: "table" },
          encode: {
            enter: {
              x: { scale: "x", field: "x" },
              x2: {
                scale: "x",
                signal: `datum.x + binX.step`,
                offset: 0.5
              },
              y: { scale: "y", field: "y" },
              y2: {
                scale: "y",
                signal: `datum.y + binY.step`,
                offset: -0.5
              },
              tooltip: { signal: "datum" }
            },
            update: {
              fill: { scale: "color", field: "value" }
            }
          }
        }
      ]
    },
    { defaultStyle: true }
  ).catch(console.error);
}
