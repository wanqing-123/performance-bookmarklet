/*
iFrame and holder logic
*/
import dom from "../helpers/dom";
import { style } from "../helpers/style";

/**
 * iFrame to contain perf-bookmarklet's diagrams
 * @type {HTMLIFrameElement}
 */
let iFrameEl;

/**
 * Holder element
 * @type {HTMLDivElement}
 */
let outputHolder;

/** @type {HTMLDivElement}  */
let outputContent;

/**
 * Holder document for perf-bookmarklet (in iFrame)
 * @type {Document}
 */
let outputIFrame;

/** setup iFrame overlay */
const initHolderEl = () => {
	// find or create holder element
	if (!outputHolder) {
		outputHolder = dom.newTag("div", { id: "perfbook-holder" });
		outputContent = dom.newTag("div", { id: "perfbook-content" });
		window.outputContent;

		const closeBtn = dom.newTag("button", {
			class: "perfbook-close",
			text: "close"
		});
		closeBtn.addEventListener("click", () => {
			iFrameEl.parentNode.removeChild(iFrameEl);
		});

		outputHolder.appendChild(closeBtn);
		outputHolder.appendChild(outputContent);
	} else {
		outputContent = outputIFrame.getElementById("perfbook-content");
		//clear existing data
		while (outputContent.firstChild) {
			outputContent.removeChild(outputContent.firstChild);
		}
	}
};

let addComponent = (domEl) => {
	outputContent.appendChild(domEl);
};

let getOutputIFrame = () => {
	return outputIFrame
}

export default  {
	/**
	 * @param  {function} onIFrameReady
	 */
	setup: (onIFrameReady) => {

		iFrameEl = document.getElementById("perfbook-iframe");

		const finalize = () => {
			initHolderEl();
			onIFrameReady(addComponent);
			outputIFrame.body.appendChild(outputHolder);
			if (getComputedStyle(document.body).overflow != "hidden") {
				iFrameEl.style.height = (outputHolder.clientHeight + 36) + "px";
			} else {
				iFrameEl.style.height = "100%";
			}
		};

		if (iFrameEl) {
			outputIFrame = iFrameEl.contentWindow.document;
			outputHolder = outputIFrame.getElementById("perfbook-holder");

			initHolderEl();

			onIFrameReady(addComponent);

			finalize();
		} else {
			iFrameEl = dom.newTag("iframe", {
				id: "perfbook-iframe",
				onload: () => {
					outputIFrame = iFrameEl.contentWindow.document;

					//add style to iFrame
					const styleTag = dom.newTag("style", {
						type: "text/css",
						text: style
					});

					outputIFrame.head.appendChild(styleTag);
					finalize();
				}
			}, "position:absolute; top:1%; right:1%; margin-bottom:1em; left:1%; z-index:6543210; width:98%; border:0; box-shadow:0 0 25px 0 rgba(0,0,0,0.5); background:#fff;");
			document.body.appendChild(iFrameEl);
		}
	},
	getOutputIFrame: getOutputIFrame
}
