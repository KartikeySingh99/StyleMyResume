const useMakeURLShort = () => {

    function returnUserNameFromURL(url) {
        if (url && url.includes('linkedin.com')) {
            let parts = url.split('/');
            let name = parts[parts?.length - 2];
            // console.log(name);
            return "linkedin/" + name;
        }
        if (url && url.includes('github.com')) {
            let parts = url.split('/');
            let name = parts[parts?.length - 1];
            // console.log(name);
            return "github/" + name;
        }
    }

    return {
        returnUserNameFromURL
    }
}

export default useMakeURLShort;