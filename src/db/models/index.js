//const Favorites = require("./Favorites");
const User = require("./User");
const Report = require("./Report");
const Task = require("./Task");
const Student = require("./Student");
const ReportComment = require("./ReportComment");
const Psycho = require("./Psycho");
const Teacher = require("./Teacher");
const UtecMember = require("./UtecMember");
const Group = require("./Group");
const Message = require("./Message");
const Content = require("./Content");
const Reaction = require("./Reaction");
const Post = require("./Post");
const Event = require("./Event");
const Comment = require("./Comment");
const Follower = require("./Follower");


// Student.hasMany(Report, { as: 'reports', foreignKey: 'studentId' });

//Reports
Report.belongsTo(Student);
Report.hasMany(ReportComment, { as: 'reportComments' });

//User
User.belongsToMany(Group, { through: 'UserGroup', as: "userGroups" });
User.hasMany(Message, { as: 'sentMessages', foreignKey: "senderId" });
User.hasMany(Message, { as: 'receivedMessages', foreignKey: "receiverId" });
User.hasMany(Content, { as: 'userContent' }) //events, posts, comments
User.belongsToMany(Content, { through: Reaction }); //usuario reacciona a muchos contenidos
User.belongsToMany(User, {
  as: 'followers',
  through: Follower,
  foreignKey: 'followedId'
});

User.belongsToMany(User, {
  as: 'follows',
  through: Follower,
  foreignKey: 'followerId'
});
User.hasOne(Student, { as: "studentInfo", foreignKey: "userId" });
User.hasOne(Teacher, { as: "teacherInfo", foreignKey: "userId" });
User.hasOne(UtecMember, { as: "otherInfo", foreignKey: "userId" });
User.hasOne(Psycho, { as: "psychoInfo", foreignKey: "userId" });

//Content
Content.belongsTo(User);
Content.belongsTo(Group);
Content.belongsToMany(User, { through: Reaction }); //un contenido es reaccionado por muchos usuarios
Content.hasMany(Comment, { as: "comments" })
Content.hasOne(Post, { as: "postInfo", foreignKey: "contentId" });
Content.hasOne(Event, { as: "eventInfo", foreignKey: "contentId" });

//Comment
Comment.belongsTo(Content, { as: "parentContent" });
Comment.hasMany(Comment, { as: "subComments", foreignKey: "parentCommentId" })
Comment.belongsTo(Comment, { as: "parentComment", foreignKey: "parentCommentId" })

//Post
//Post.belongsTo(Content);

//Event
//Event.belongsTo(Content);

//Group
Group.belongsToMany(User, { through: 'UserGroup', as: "groupMembers" });
Group.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });
Group.hasMany(Content, { as: "groupContent" })

//Message
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

//Student
Student.hasMany(Report, { as: 'reports' });
Student.hasMany(Task, { as: 'tasks' });
Student.belongsToMany(Psycho, { through: 'StudentPsycho', as: 'psychos' });

//ReportComment
ReportComment.belongsTo(Report);
ReportComment.belongsTo(Psycho);

//Psycho
//Psycho.belongsTo(User);
Psycho.belongsToMany(Student, { through: 'StudentPsycho', as: "studentsToAdvise" });


//Tasks
//Task.belongsTo(Student);

//Teacher
//Teacher.belongsTo(User);


//UtecMember
//UtecMember.belongsTo(User);




module.exports = {
  User, Report, Task,
  Student,
  ReportComment,
  Psycho,
  Teacher,
  UtecMember,
  Group,
  Message,
  Content,
  Reaction,
  Post,
  Event,
  Comment,
  Follower,
};