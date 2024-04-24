import { faker } from "@faker-js/faker";

export interface ApplicationSubmissionForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirmed: string
}

export function getApplicationSubmissionData(
    firstName: string,
    lastName: string,
    email: string,
    password: string, 
    passwordConfirmed?: string | null, 
): ApplicationSubmissionForm {
    const generatedData: ApplicationSubmissionForm = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        passwordConfirmed: passwordConfirmed  || password,
    };

    return generatedData;
}

export function getGeneratedApplicationSubmissionData(){
    return getApplicationSubmissionData(
        faker.person.firstName(),
        faker.person.lastName(),
        faker.internet.email(),
        faker.internet.password())
}
