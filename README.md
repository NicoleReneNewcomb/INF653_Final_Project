# Nicole-Rene Newcomb's INF653 Final Project

## States Fun Facts Node.js REST API Hosted on Glitch.com
[View Project on Glitch](https://flowery-abiding-caption.glitch.me/)

## Description of Project
This project uses a MongoDB collection to contain the fun facts for each state. The state is represented by the State.js model in the project. Further information about the states is retrieved from the statesData.json file. The endpoints process requests that facilitate database interactions, including the creation, reading, updating, and deletion of records (CRUD functions).

## Endpoints
The available endpoints include the following: 
- **/states** endpoint: 
  - GET request returns all the state data
    - adding ?contig=true or ?contig=false will return contiguous or non-contiguous states only
- **/states/:state** endpoint:
  - GET request returns data for single state
- **/states/:state/funfact** endpoint:
  - GET request returns random fun fact from state's fun fact array
  - POST request allows addition of fun fact to state's fun fact array
  - PATCH request allows the updating of a fun fact by index of the state's fun fact array
  - DELETE request allows the deletion of a fun fact by index of the state's fun fact array
- **/states/:state/capital** endpoint:
  - GET request returns the state name and capital
- **/states/:state/nickname** endpoint:
  - GET request returns the state name and nickname
- **/states/:state/population** endpoint:
  - GET request returns the state name and population
- **/states/:state/admission** endpoint:
  - GET request returns the state name and admission date
