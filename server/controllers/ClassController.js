import SpecializationModel from "../models/SpecializationModel.js"
import ProjectModel from "../models/ProjectModel.js";
import UserModel from "../models/UserModel.js";



export const getAllClasses = async (req, res) => {
    try {
        const classes = await SpecializationModel.find().populate('ownedBy').exec();

        // Create an array to store the modified class objects
        const classesWithStudentCount = [];

        // Iterate through each class
        for (const classObj of classes) {
            // Count the number of students enrolled in the current class
            const studentCount = await UserModel.countDocuments({ specialization: classObj._id, role:'student' });

            const classWithCount = {
                _id: classObj._id,
                year: classObj.year,
                specialization:classObj?.specialization,
                semester: classObj.semester,
                ownedBy: classObj.ownedBy,
                subjects:classObj.subjects,
                // Add the student count to the class object
                studentCount: studentCount,
            };

            // Push the modified class object to the array
            classesWithStudentCount.push(classWithCount);
        }

        res.status(200).json(classesWithStudentCount);
    } catch (error) {
        res.status(500).json({
            message: error.mesasge
        })
    }
}

export const getOneClass = async (req, res) => {
    const { id } = req.params;

    try {
        const isClassExist = await SpecializationModel.findById(id);
        if (!isClassExist) {
            throw Error('That class not exist');

        }
        res.status(200).json(isClassExist);

    } catch (error) {
        res.status(500).json({
            message: error.mesasge
        })
    }
}

export const createClass = async (req, res) => {
    const data = req.body

    try {
        const classData = {
            year: data.grade,
            semester: data.subClass,
            students: Array(),
            ownedBy: null,
            subjects: Array()
        }

        const isClassExist = await SpecializationModel.findOne({grade:data.grade,subClass:data.subClass});
        if(isClassExist){
            throw Error('Class Is Already Exist!')
        }

        const isSaved = await SpecializationModel.create(classData);

        res.status(200).json({ message: 'Class Created Successfully' })

    } catch (error) {
        res.status(500).json({
            message: error.mesasge
        })
    }
}

export const getStudentsInClass = async (req, res) => {
    const { id } = req.params;

    try {
        const allStudents = await UserModel.find({ role: 'student', specialization: id });
        if (!allStudents) {
            throw Error('No Students Or Other Error');

        }
        res.status(200).json(allStudents);

    } catch (error) {
        res.status(500).json({
            message: error.mesasge
        })
    }
}

export const updateClassTeacher = async (req, res) => {
    const { id } = req.params;
    const { ownedBy } = req.body;

    try {
        console.log(id);
        const isAlreadyHaveClass = await SpecializationModel.find({ownedBy:ownedBy});
        if(isAlreadyHaveClass.length ==1 ){
            throw Error('One Teacher Can Own Only One Class');
        }
        const updateClass = await SpecializationModel.findById(id);
        if (!updateClass) {
            res.status(500).json({ message: 'Class Not Found' });
            return
        }
        updateClass.ownedBy = ownedBy;

        updateClass.save();
        console.log(updateClass);

        res.status(200).json({ message: 'Class Teacher Assigned Success!!', updateClass });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const getOneClassByTeacherId = async (req, res) => {
    const { id } = req.params;

    try {
        const isClassExist = await SpecializationModel.findOne({ ownedBy: id });
        if (!isClassExist) {
            throw Error('That class not exist');

        }
        res.status(200).json(isClassExist);

    } catch (error) {
        res.status(500).json({
            message: error.mesasge
        })
    }
}

export const getStudentsInSubject = async (req, res) => {
    //Subject id
    const { subid } = req.params;

    try {
        const subject = await ProjectModel.findById(subid);
        if(!subject){
            throw Error('No Subject in that ID')
        }
        const classIn = await SpecializationModel.findById(subject.classId);

        if(!classIn){
            throw Error('No Class For that Subject')
        }

        const allStudents = await UserModel.find({ role: 'student', classId: classIn._id });
        if (!allStudents) {
            throw Error('No Students Or Other Error');

        }
        res.status(200).json(allStudents);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.mesasge
        })
    }
}

export const gradeUp = async (req, res) => {
    try {
        const upgrade = await SpecializationModel.updateMany({}, { $inc: { grade: 1 } });
        res.status(200).json({message:'All Grades are incremented by one'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
