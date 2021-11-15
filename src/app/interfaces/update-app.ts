export interface UpdateApp {
    current: string;
    enabled: boolean,
    msg?: {
        title: string,
        msg: string,
        btn: string
    },
    majorMsg?: {
        title: string,
        msg: string,
        btn: string
    },
    minorMsg?: {
        title: string,
        msg: string,
        btn: string
    }
}