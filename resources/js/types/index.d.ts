export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    person: {
        PERSON_FIRST_NAME: string;
        RELATION_ORGANIZATION_ID: string;
        DIVISION_ID: string;
        division: {
            RELATION_DIVISION_ALIAS: string;
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
