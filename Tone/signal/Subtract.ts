import { connectSeries } from "../core/Connect";
import { Gain } from "../core/context/Gain";
import { Param } from "../core/context/Param";
import { optionsFromArguments } from "../core/util/Defaults";
import { Negate } from "../signal/Negate";
import { Signal, SignalOptions } from "../signal/Signal";

/**
 * Subtract the signal connected to the input is subtracted from the signal connected
 * The subtrahend.
 *
 * @param value The value to subtract from the incoming signal. If the value
 *                         is omitted, it will subtract the second signal from the first.
 * @example
 * var sub = new Subtract(1);
 * var sig = new Tone.Signal(4).connect(sub);
 * //the output of sub is 3.
 * @example
 * var sub = new Subtract();
 * var sigA = new Tone.Signal(10);
 * var sigB = new Tone.Signal(2.5);
 * sigA.connect(sub);
 * sigB.connect(sub.subtrahend);
 * //output of sub is 7.5
 */
export class Subtract extends Signal {

	override = false;

	name = "Subtract";

	/**
	 *  the summing node
	 */
	private _sum: Gain = new Gain({ context: this.context });
	input = this._sum;
	output = this._sum;

	/**
	 *  Negate the input of the second input before connecting it to the summing node.
	 */
	private _neg: Negate = new Negate({ context : this.context });

	/**
	 * The value which is subtracted from the main signal
	 */
	subtrahend: Param<number> = this._param;

	constructor(options?: Partial<SignalOptions<number>>);
	// tslint:disable-next-line: unified-signatures
	constructor(value?: number);
	constructor() {
		super(Object.assign(optionsFromArguments(Subtract.getDefaults(), arguments, ["value"])));
		const options = optionsFromArguments(Subtract.getDefaults(), arguments, ["value"]);

		connectSeries(this._constantSource, this._neg, this._sum);
	}

	static getDefaults(): SignalOptions<number> {
		return Object.assign(Signal.getDefaults(), {
			value: 0,
		});
	}

	/**
	 *  Clean up.
	 *  @returns {Tone.SignalBase} this
	 */
	dispose(): this {
		super.dispose();
		this._neg.dispose();
		this._sum.disconnect();
		return this;
	}
}
