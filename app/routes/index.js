export default (app) => {
    app.use("/api/v1/users", require("./user.route").default);
    app.use("/api/v1/events", require("./event.route").default);
}