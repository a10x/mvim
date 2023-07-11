export default class Utils{

	public static async resolvePromise<T>(promise: Promise<T>){
		let value: T | undefined;

		try{
			value = await promise;
		}catch(e){
			value = undefined;
		}

		return value;
	}

}