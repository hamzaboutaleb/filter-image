import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
    // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
    // IT SHOULD
    //    1
    //    1. validate the image_url query
    //    2. call filterImageFromURL(image_url) to filter the image
    //    3. send the resulting file in the response
    //    4. deletes any files on the server on finish of the response
    // QUERY PARAMATERS
    //    image_url: URL of a publicly accessible image
    // RETURNS
    //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

    //! END @TODO1
    app.get("/filteredimage", async function (req: Request, res: Response) {
        let imageUrl: string = req.query.image_url;

        // validate the image_url query
        if (!imageUrl)
            res.status(422).json({
                message: "image url param is required",
            });
        try {
            //filter the image
            let filteredImagePath: string = await filterImageFromURL(imageUrl);
            //send the resulting file in the response
            res.sendFile(filteredImagePath, (err: Error) => {
                if (err)
                    return res.status(422).json({
                        message: "response handling failed",
                        err: err.message,
                    });
                //delete file
                deleteLocalFiles([filteredImagePath]);
            });
        } catch (error) {
            // return 422 with error if any error happend
            return res.status(422).json({
                message: "processing image failed, Please try again",
                error: error.message,
            });
        }
    });
    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", async (req: Request, res: Response) => {
        res.send("try GET /filteredimage?image_url={{}}");
    });

    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();
