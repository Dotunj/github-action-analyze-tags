const { exec } = require("child_process");
const core = require("@actions/core");

let currentTag, previousTag, highestTag, rev;

//fetch the current Tag
exec("git describe --tags", (err, stdout, stderr) => {
  if (err) {
    core.error(stderr);
    process.exit(1);
  }

  currentTag = stdout.trim();

  core.info(`Current Tag is ${currentTag}`);

  exec("git rev-list --tags --skip=1 --max-count=1", (err, stdout, stderr) => {
    if (err) {
      core.error(stderr);
      process.exit(1);
    }

    rev = stdout.trim();

    core.info(`Revision is ${rev}`);

    //fetch the previous tag
    exec(`git describe --abbrev=0 --tags ${rev}`, (err, stdout, stderr) => {
      if (err) {
        core.error(stderr);
        process.exit(1);
      }

      previousTag = stdout.trim();

      core.info(`Previous Tag is ${previousTag}`);

      //fetch the highest tag
      exec(
        `git tag -l --sort -version:refname | head -n 1`,
        (err, stdout, stderr) => {
          if (err) {
            core.error(stderr);
            process.exit(1);
          }

          highestTag = stdout.trim();

          core.info(`Highest Tag is ${highestTag}`);

          let compareWithPrevious, compareWithHighest;

          [compareWithPrevious, compareWithHighest] = [
            compareSemVersion(currentTag, previousTag),
            compareSemVersion(currentTag, highestTag),
          ];

          let isCurrentTagHighest = false;

          //current tag should only be the highest if it is greater than the previous tag and equal or greater to the highest tag
          if (
            [1].includes(compareWithPrevious) &&
            [1, 0].includes(compareWithHighest)
          ) {
            isCurrentTagHighest = true;
          }

          core.info(`is Current Tag the Highest ${isCurrentTagHighest}`);

          core.setOutput("current_tag", currentTag);
          core.setOutput("previous_tag", previousTag);
          core.setOutput("highest_tag", highestTag);
          core.setOutput("is_current_tag_the_highest", isCurrentTagHighest);
          process.exit(0);
        }
      );
    });
  });
});

function compareSemVersion(currentTag, previousTag) {
  //assumes the current tag is less than the previous tag if it's a release candidate
  if (currentTag.includes("rc")) {
    return -1;
  }

  var ct = currentTag.split(".");
  var pt = previousTag.split(".");

  for (var i = 0; i < 3; i++) {
    var na = Number(ct[i]);
    var nb = Number(pt[i]);

    if (na > nb) return 1;
    if (nb > na) return -1;

    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }

  return 0;
}
