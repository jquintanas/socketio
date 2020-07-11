import { Request, Response } from "express";
class indexController {
    public cargarIndex(req: Request, res: Response) {
        res.render("index")
    }

}

export default new indexController();