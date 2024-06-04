# Font Metrics API

This is a tiny simple express app that calculates font metrics using the \`fontkit\` library. It provides a single endpoint to upload a font file and retrieve its metrics.

## Installation

1. Clone the repository:

     ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install the dependencies:

    ```bash
    yarn install
    ```

## Usage

1. Start the server:

    ```bash
    yarn start
    ```

   The server will run on port 6000.

2. Send a POST request to the \`/font\` endpoint with the font file as the request body.

### Example

Use `curl` to send a font file to the server:

```bash
curl -X POST -H "Content-Type: application/octet-stream" --data-binary @path/to/font-file.ttf http://localhost:6000/font
```

### Response

The server responds with a JSON object containing:

- \`widths\`: Array of widths for ASCII characters.
- \`mean\`: Mean width of ASCII characters.
- \`ascent\`: Ascent of the font.
- \`descent\`: Descent of the font.
- \`lineHeight\`: Line height of the font.

#### Example Response

```json
{
  "widths": [0, 0, 0, ..., 0.5, 0.6, 0.7, ...],
  "mean": 0.5,
  "ascent": 0.8,
  "descent": -0.2,
  "lineHeight": 1.0
}
```