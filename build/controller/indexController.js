"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class indexController {
    cargarIndex(req, res) {
        res.render("index");
    }
}
exports.default = new indexController();
