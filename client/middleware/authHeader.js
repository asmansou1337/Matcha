module.exports = () => {
    console.log("jwt ---> " + req.cookies.jwt);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + req.cookies.jwt;
    next();
}