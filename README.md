# Node.js University Exercises

This repository is a personal archive of Node.js exercises, lab work, and small projects completed during university.

The codebase is organized by lab, so each folder is usually self-contained and can be run independently. Most labs use Express, Handlebars, sessions, authentication, MongoDB, file uploads, or small frontend practice pages.

## Repository Structure

- `labs/` contains coursework and practice projects grouped by lab number.
- `class_exercises/` contains additional lab and class exercise projects.
- `LICENSE` contains the project license.

## How To Run A Lab

1. Open the lab folder you want to run in the terminal first.
2. For example, if you want to run `labs/lab10`, open that folder in the terminal before installing packages.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the project using the script defined in that lab’s `package.json`:

   ```bash
   npm start
   ```

Some labs use `app.js` and others use `index.js` as the entry point, so check the `scripts` section inside the lab’s `package.json` if you are unsure.

## Notes

- Many labs are learning projects, so the code may reflect experiments and classroom exercises rather than production-ready patterns.
- Some projects may require environment variables, database access, or extra setup files inside the lab folder.

## License

See `LICENSE` for details.
