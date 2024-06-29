<div align="center">

# PDDT Editor

GUI Editor for Prompt-Driven Decision Trees (PDDTs)

[![youtube](https://img.shields.io/badge/watch%20the%20walkthrough-%20?style=for-the-badge&logo=youtube&color=red)](https://github.com/chroline/pddt-editor)
[![substack](https://img.shields.io/badge/read%20the%20blog%20post-%20?style=for-the-badge&logo=substack&color=gray)](https://github.com/chroline/pddt-editor)
<br />
![GitHub License](https://img.shields.io/github/license/chroline/pddt-editor?style=for-the-badge&color=blue)
[![chat](https://img.shields.io/badge/chat-discussions-success?style=for-the-badge)](https://github.com/chroline/pddt-editor/discussions)

</div>

## Overview

The PDDT Editor is a graphical user interface for creating and managing Prompt-Driven Decision Trees (PDDTs). PDDTs combine the interpretability of classical machine learning methods with the adaptability of large language models, enabling new AI workflows and reducing development time and complexity.

This GUI editor (available at `/editor`) is built on top using Next.js, React Flow, and Redis (Vercel KV). Each decision node, in addition to resources and the head prompt, is stored as a key as a key-value pair in the database. This allows for blazing fast read times at each step in the tree.

To test the PDDT you developed, a playground is also available at `/playground` that allows for the visualization of each decision made for different inputs.

## Features

- **Intuitive GUI**: Easily create and manage PDDTs through a user-friendly interface.
- **Integration with LLMs**: Leverage the power of large language models at each decision node.
- **Export and Import**: Seamlessly export and/or import previously created PDDTs.

## Getting Started

1. [Clone this repository.](https://github.com/new?template_name=pddt-editor&template_owner=chroline)
2. Deploy your repository to Vercel.
3. [Create a new KV database on Vercel.](https://vercel.com/docs/storage/vercel-kv/quickstart#create-a-kv-database)
4. Fill in the required environment variables (follow `.env.example` template).

## Contributing
We welcome contributions from the community! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

If you have any questions or feedback, feel free to reach out to me at [mailto:colegawin@gmail.com](colegawin@gmail.com).