const express = require('express');
const router = express.Router();
const {
    CreateJob,
    GetAllJobs,
    DeleteJob,
    EditJob,
    GetSingleJob } = require('../controllers/jobs')

router.route("/").get(GetAllJobs).post(CreateJob)
router.route("/:id").get(GetSingleJob).delete(DeleteJob).patch(EditJob)

module.exports = router