export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    person: {
        PERSON_ID: string;
        PERSON_FIRST_NAME: string;
        RELATION_ORGANIZATION_ID: string;
        DIVISION_ID: string;
        division: {
            RELATION_DIVISION_ID: string;
            RELATION_DIVISION_ALIAS: string;
            RELATION_DIVISION_INITIAL: string;
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
