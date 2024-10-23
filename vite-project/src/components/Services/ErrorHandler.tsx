import axios from "axios";

export const handleError = (error: any) => {
    if(axios.isAxiosError(error)) {
        var err = error.response;
        if(Array.isArray(err?.data.errors)) {
            for (let val of err.data.errors){
                alert(val.description);
            }
        }else if (typeof err?.data.errors === 'object'){
            for (let e in err?.data.errors) {
                alert(err.data.errors[e][0]);
            }
        } else if (err?.data) {
            alert(err.data);
        }else if (err?.status == 401 || err?.status === 403){
            alert("Please login");
            window.history.pushState({}, "Login", "/");
        }else if (err) {
            alert(err?.data);
        }
    }
}
