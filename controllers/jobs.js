const JobScheme = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const CreateJob = async (req, res) =>
{
    req.body.createdBy = req.user.userId;
    const job = await JobScheme.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
};

const GetAllJobs = async (req, res) =>
{
    const jobs = await JobScheme.find({ createdBy: req.user.userId });
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const DeleteJob = async (req, res) =>
{
    const {
        user: { userId },
        params: { id },
    } = req;
    const job = await JobScheme.findByIdAndRemove({
        _id: id,
        createdBy: userId,
    });
    if (!job)
    {
        throw new NotFoundError("Job not found");
    }
    res.status(StatusCodes.OK).json({ msg: 'Job deleted successfully' });
};

const EditJob = async (req, res) =>
{
    const {
        body: { company, position },
        user: { userId },
        params: { id },
    } = req;
    if (company === "" || company === "")
    {
        throw new BadRequestError("company or position cannot be empty");
    }

    const job = await JobScheme.findByIdAndUpdate({
        _id: id,
        createdBy: userId,
    }, req.body, { new: true, runValidators: true });
    if (!job)
    {
        throw new NotFoundError("Job not found");
    }
    res.status(StatusCodes.OK).json({ job });
};

const GetSingleJob = async (req, res) =>
{
    const {
        user: { userId },
        params: { id },
    } = req;
    const job = await JobScheme.findOne({
        _id: id,
        createdBy: userId,
    });
    if (!job)
    {
        throw new NotFoundError("Job not found");
    }
    res.status(StatusCodes.OK).json({ job });
};

module.exports = {
    CreateJob,
    GetAllJobs,
    DeleteJob,
    EditJob,
    GetSingleJob,
};
