function PdfjsBorderEmulator()
{
};

PdfjsBorderEmulator.prototype =
{
	/**
	 *  The language code of the running application.
	 *
	 *  @property language
	 *  @type {String}
	 *  @readOnly
	 */
	set s(val)
	{

	},
	
	/**
	 *  The platform the script is currently executing on.
	 *
	 *  @property platform
	 *  @type {String}
	 *  @readOnly
	 */
	get s()
	{
		return "";
	}
};


// instantiate object
var border = new PdfjsBorderEmulator();