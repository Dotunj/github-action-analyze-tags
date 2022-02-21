# Analyze Tags

This is a GitHub Action to get the current, previous and highest tag from git.

It would be more useful to use the output from this action to conditionally trigger jobs within your workflow.


## Outputs

|    NAME                          |                                               DESCRIPTION                                               |   TYPE   |
| ------------                     | ------------------------------------------------------------------------------------------------------  | -------- |
| `current_tag`                    | The current tag in the repository.                                                                         | `string` |
| `highest_tag`                    | The highest tag in the repository.                                                                         | `string` |
| `is_current_tag_the_highest`     | Determines if the current tag is the highest tag so far in the repository                                  | `boolean` |

## License

Copyright 2022 Dotun Jolaoso

Analyze Tags is released under the [MIT License](./LICENSE).
