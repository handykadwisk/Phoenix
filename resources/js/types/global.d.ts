import { AxiosInstance } from "axios";
import { route as ziggyRoute } from "ziggy-js";

declare global {
    interface Window {
        axios: AxiosInstance;
        Echo: any; // Atau gunakan tipe yang lebih spesifik jika tersedia
    }

    var route: typeof ziggyRoute;
}
