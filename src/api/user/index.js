import request from "@/api";
import qs from "qs"

export function login(data) {
    return request({
        url: '/auth/oauth/token',
        method: 'post',
        data: qs.stringify(data),
        headers: {'content-type': 'application/x-www-form-urlencoded'},
    })
}

