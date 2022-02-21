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

      let compareWithHighest;

      compareWithHighest = compareSemVersion(currentTag, highestTag);

      let isCurrentTagHighest = false;

      //current tag should only be the highest if it is greater than or equal to the highest tag
      if ([1, 0].includes(compareWithHighest)) {
        isCurrentTagHighest = true;
      }

      core.info(`is Current Tag the Highest ${isCurrentTagHighest}`);

      core.setOutput("current_tag", currentTag);
      core.setOutput("highest_tag", highestTag);
      core.setOutput("is_current_tag_the_highest", isCurrentTagHighest);
      process.exit(0);
    }
  );
});

function compareSemVersion(currentTag, highestTag) {
  //assumes the current tag is less than the previous tag if it's a release candidate
  if ((currentTag || "").toLowerCase().includes("rc")) {
    return -1;
  }

  var ct = currentTag.split(".");
  var ht = highestTag.split(".");

  for (var i = 0; i < 3; i++) {
    var na = Number(ct[i]);
    var nb = Number(ht[i]);

    if (na > nb) return 1;
    if (nb > na) return -1;

    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }

  return 0;
}
