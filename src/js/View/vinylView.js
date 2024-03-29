export class VinylView {
  constructor(target) {
    this.target = target;
  }

  template() {
    const div = document.createElement("div");

    div.className = "deck-middle-vinyl";
    div.innerHTML = `
    <svg viewBox="0 0 512 512" id="record_svg">
          <g>
            <g id="record_group">
            <circle
              r="256"
              transform="scale(1,-1)"
              cy="-256"
              cx="256"
              style="fill:#000000;fill-opacity:1" />
            <path
              d="m 343,256 a 87,87 0 0 1 -87,87 87,87 0 0 1 -87,-87 87,87 0 0 1 87,-87 87,87 0 0 1 87,87 z"
              style="fill:#C64945;fill-opacity:1;stroke:none;stroke-width:4;stroke-miterlimit:4;stroke-dasharray:none" />
            <circle
              style="fill:none;fill-opacity:1;stroke:#ffcc00;stroke-width:4;stroke-miterlimit:4;stroke-dasharray:none"
              cx="256"
              cy="256"
              r="72" />
            <path
              d="m 270,256 a 14,14 0 0 1 -14,14 14,14 0 0 1 -14,-14 14,14 0 0 1 14,-14 14,14 0 0 1 14,14 z"
              style="fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:4;stroke-miterlimit:4;stroke-dasharray:none" />
            <text
              id="text4175"
              y="225.5"
              x="212.80206"
              style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:17.5px;line-height:125%;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              xml:space="preserve"><tspan
                style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-family:Futura;-inkscape-font-specification:'Futura Bold'"
                y="225.5"
                x="200.91144">Vinyla Shake</tspan></text>
            <text
              xml:space="preserve"
              style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:15px;line-height:125%;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              x="210.76865"
              y="290.0"><tspan
                x="225.76865"
                y="290.0"
                style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:12.5px;font-family:Futura;-inkscape-font-specification:'Futura Bold'">Vinyla JS</tspan></text>
            <text
              y="305.0"
              x="208.4707"
              style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-size:10px;line-height:125%;font-family:Futura;-inkscape-font-specification:'Futura Medium';letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
              xml:space="preserve"><tspan
                y="305.0"
                x="208.4707">ECMAScript Records</tspan></text>
            </g>
            <g>
              <path
                style="fill:none;fill-opacity:1;stroke:#cccccc;stroke-width:4;stroke-miterlimit:4;stroke-dasharray:none"
                d="m 60,256 c 6e-6,-108.24781 87.75219,-195.99999 196,-195.99999" />
              <path
                style="fill:none;fill-opacity:1;stroke:#cccccc;stroke-width:4;stroke-miterlimit:4;stroke-dasharray:none"
                d="m 100,256 c 0,-86.15642 69.84358,-156 156,-156" />
              <path
                style="fill:none;fill-opacity:1;stroke:#cccccc;stroke-width:4;stroke-miterlimit:4;stroke-dasharray:none"
                d="m 128,256 c 0,-70.69245 57.30755,-128 128,-128" />
            </g>
            <g
              style="stroke:#666666"
              transform="matrix(-1,0,0,-1,512,1052.36222)">
              <path
                d="m 60,796.36217 c 6e-6,-108.24781 87.75219,-195.99999 196,-195.99999"
                style="fill:none;fill-opacity:1;stroke:#666666;stroke-width:4;stroke-miterlimit:4;stroke-dasharray:none" />
              <path
                d="m 100,796.36218 c 0,-86.15642 69.84358,-156 156,-156"
                style="fill:none;fill-opacity:1;stroke:#666666;stroke-width:4;stroke-miterlimit:4;stroke-dasharray:none" />
              <path
                d="m 128,796.36218 c 0,-70.69245 57.30755,-128 128,-128"
                style="fill:none;fill-opacity:1;stroke:#666666;stroke-width:4;stroke-miterlimit:4;stroke-dasharray:none" />
            </g>
            <g id="surface_group">
                <path
                  style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:3px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                  d="m 225,92 17,53" />
                <path
                  style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:3px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                  d="m 442,288 18,4" />
                <path
                  style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:3px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                  d="m 112,238 -62,-8" />
              <g transform="matrix(1,0,0,-1,0,1052.36224)">
                <path
                  d="m 282,912.36216 5,18"
                  style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:3px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
                <path
                  d="m 352,958.36216 8,13"
                  style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:3px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
                <path
                  d="m 112,778.36216 -62,-8"
                  style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:3px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" />
              </g>
            </g>
          </g>
        </svg>
        `;

    return div;
  }

  render() {
    this.target.append(this.template());
  }

  updateRecord(angle) {
    this.target
      .querySelector("#record_group")
      .setAttribute("transform", `rotate(${angle}, 256, 256)`);
    this.target
      .querySelector("#surface_group")
      .setAttribute("transform", `rotate(${angle}, 256, 256)`);
  }
}
