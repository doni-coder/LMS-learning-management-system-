import { pool } from "../db/sql.db.js"
import { liveStreamNotification } from "../models/course.models.js"

const getPushNotification = async (req, res) => {
    try {
        const userId = req.user?.id
        let liveClasses = []
        const enrolledCourse = await pool.query(`
            SELECT * FROM ENROLLED_COURSES WHERE STUDENT_ID = $1
        `, [userId])
        if (enrolledCourse.rows.length === 0) {
            return res.status(200).json({
                liveClasses
            })
        }
        liveClasses = (await Promise.all(
            enrolledCourse.rows.map((course) => {
                console.log("course-----:", course)
                return liveStreamNotification.findOne({ courseId: course.course_id })
            }
            )
        )).filter(Boolean)
        console.log("live classes:", liveClasses)
        res.json({
            liveClasses
        })
    } catch (error) {
        return res.status(500).json({
            message: " can't retrive liveclasses "
        });
    }
}

export { getPushNotification }