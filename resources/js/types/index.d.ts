export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    employee: {
        EMPLOYEE_ID: string;
        EMPLOYEE_FIRST_NAME: string;
        COMPANY_ID: string;
        DIVISION_ID: string;
        division: {
            COMPANY_DIVISION_ID: string;
            COMPANY_DIVISION_ALIAS: string;
            COMPANY_DIVISION_INITIAL: string;
        };
    };
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
