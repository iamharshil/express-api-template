export interface IUser {
	_id?: string;
	name: string;
	username: string;
	email: string;
	password: string;
	createdAt?: Date;
	updatedAt?: Date;
}
