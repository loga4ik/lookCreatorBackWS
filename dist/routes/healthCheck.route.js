import { Router } from "express";
// const Router = require("express").Router();
const router = Router();
router.get("/", async (req, res) => {
    console.log("работает ....что-то, наверное");
    try {
        res.json({
            message: "OK",
            timestamp: Date.now(),
            uptime: process.uptime(),
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
export default router;
//# sourceMappingURL=healthCheck.route.js.map