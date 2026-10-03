(function () {
  const names = [
    'Nina Park','Marcus Reed','Emma Chen','David Okafor','Maria Santos','Alex Morgan','Sarah Kim','Jordan Bell','Priya Shah','Liam Walker',
    'Maya Patel','Noah Williams','Sofia Martinez','Ethan Brooks','Chloe Nguyen','Lucas Brown','Ava Thompson','Miles Carter','Zoe Robinson','Owen Davis',
    'Isla Turner','Caleb Wright','Amara Lewis','Henry Scott','Layla Adams','Theo Baker','Ella Harris','Leo Clark','Mia Campbell','Jack Evans',
    'Aria Hall','Sam Wilson','Ruby Taylor','Finn Moore','Ivy Cooper','Max Edwards','Nora Collins','Kai Stewart','Lena Mitchell','Ben Parker'
  ];
  const events = ['100 Free','200 IM','1500 Free','100 Fly','200 Back','50 Free','200 Breast','Open Water 5K'];
  const goals = ['Build aerobic capacity','Qualify for Masters Nationals','Improve turns and underwaters','Return to consistent training','Race a confident 200','Hold pace late in the race'];
  const focuses = ['Aerobic endurance','Threshold control','Speed and skills','Recovery technique','Race pace'];
  const bodies = [
    '400 easy swim\n4 x 50 kick @ 1:05\n6 x 100 free @ 1:40 build 1-3\n4 x 50 choice easy\n200 cool-down',
    '300 easy choice\n2 rounds:\n  4 x 50 drill/swim @ 1:00\n  3 x 100 threshold @ 1:35\n4 x 25 fast from push\n200 easy',
    '400 swim + 200 pull\n8 x 50 build @ 0:55\n5 x 200 aerobic @ 3:10\n4 x 50 kick easy\n200 cool-down'
  ];
  const iso = (value) => value.toISOString().slice(0, 10);
  const addDays = (value, amount) => { const next = new Date(value); next.setDate(next.getDate() + amount); return next; };
  const now = new Date();
  const weekDate = new Date(now); weekDate.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekStart = iso(weekDate), weekEnd = iso(addDays(weekDate, 6));
  const swimmers = [], workouts = [];

  names.forEach((name, index) => {
    const id = `sw_${index + 1}`, unit = index % 3 === 0 ? 'm' : 'yd';
    const swimmer = {
      id, name, email: `${name.toLowerCase().replace(/[^a-z]+/g,'.').replace(/\.$/,'')}@example.com`, status: index === 23 || index === 34 ? 'paused' : 'active',
      level: ['Competitive','Masters','Open water','Developing'][index % 4], event: events[index % events.length], goal: goals[index % goals.length], unit,
      pool_length: unit === 'm' && index % 4 === 0 ? 50 : 25, availability: ['Mon','Wed','Fri',index % 2 ? 'Sat' : 'Sun'],
      equipment: ['fins','pull buoy',index % 2 ? 'paddles' : 'snorkel'], dryland_equipment: index % 3 ? ['bands','dumbbells'] : ['bodyweight'],
      restrictions: index === 1 ? 'Monitor right shoulder. Avoid high-volume paddle work.' : index === 6 ? 'Returning from ankle strain; modify jumping.' : '',
      notes: index === 0 ? 'Responds well to one clear technical cue per set.' : '', next_meet: iso(addDays(now, 12 + index % 28)),
      meet_name: ['Harbor Masters Meet','Autumn Distance Classic','City Sprint Series'][index % 3], tags: [index % 2 ? 'Masters' : 'Competitive', index % 5 === 0 ? 'Priority' : 'Remote'],
      avatar: `./avatars/athlete-${index % 6 + 1}.jpg`, week_sessions: 0, draft_sessions: 0, published_sessions: 0, adherence: 0, last_activity: null
    };
    const sessions = index % 7 === 0 ? 0 : index % 5 === 0 ? 2 : 3;
    for (let session = 0; session < sessions; session += 1) {
      const status = index % 4 === 0 ? 'draft' : 'published', distance = 1800 + ((index + session) % 6) * 250;
      const completed = (index + session) % 3 !== 0 && session < 2;
      workouts.push({ id:`wo_${index+1}_${session}`, swimmer_id:id, day:iso(addDays(weekDate,[0,2,4][session])), type:'swim', title:`${focuses[(index+session)%5]} ${session+1}`,
        focus:focuses[(index+session)%5], body:bodies[(index+session)%3], unit, distance, minutes:55+session*5, status, version:1, published_version:status==='published'?1:null,
        updated_at:now.toISOString(), actual_distance:completed?distance-((index+session)%4)*100:null, actual_minutes:completed?54+session*5:null, rpe:completed?4+(index+session)%5:null,
        feedback:completed?['Felt smooth and controlled.','Shoulder was tight on the last set.','Held pace better than expected.','Cut the final repeat for time.'][(index+session)%4]:'', completed_at:completed?now.toISOString():null });
      swimmer.week_sessions += 1; swimmer[status === 'draft' ? 'draft_sessions' : 'published_sessions'] += 1;
      if (completed) swimmer.last_activity = now.toISOString();
    }
    if (index % 6 === 0) {
      workouts.push({ id:`dry_${index+1}`,swimmer_id:id,day:iso(addDays(weekDate,1)),type:'dryland',title:'Shoulder stability + trunk',focus:'Durable alignment',body:'2 rounds\nBand external rotation · 12/side\nDead bug · 8/side\nSide plank row · 10/side\nRest 45 seconds',unit:null,distance:0,minutes:25,status:'published',version:1,published_version:1,updated_at:now.toISOString(),actual_distance:null,actual_minutes:null,rpe:null,feedback:'',completed_at:null });
      swimmer.week_sessions += 1; swimmer.published_sessions += 1;
    }
    const swimmerWorkouts = workouts.filter((workout) => workout.swimmer_id === id);
    swimmer.adherence = swimmerWorkouts.length ? Math.round(swimmerWorkouts.filter((workout) => workout.completed_at).length / swimmerWorkouts.length * 100) : 0;
    swimmers.push(swimmer);
  });

  const conversations = names.slice(0,12).map((name,index)=>({ id:`conv_${index+1}`,swimmer_id:`sw_${index+1}`,name,avatar:`./avatars/athlete-${index%6+1}.jpg`,unread:index%4===0?1:0,updated_at:now.toISOString(),last_message:index%3===0?'Workout done. The final pace set felt controlled.':'Your plan is ready. Let me know how the main set feels.' }));
  const messages = conversations.map((conversation,index)=>({ id:`msg_${index+1}`,conversation_id:conversation.id,sender:index%3===0?'swimmer':'coach',body:conversation.last_message,created_at:now.toISOString() }));
  const resources = [
    ['res_1','set','Threshold ladder','A compact aerobic threshold progression.',['threshold','freestyle'],'3 x 100 @ CSS + 5\n2 x 200 @ CSS + 7\n3 x 100 @ CSS + 5',null],
    ['res_2','drill','6-kick switch','Balance and rotation drill for freestyle.',['freestyle','technique'],'6 x 50 as 6-kick switch / swim by 25',null],
    ['res_3','template','Race pace 100','Quality 100 pace work with generous recovery.',['race pace','sprint'],'2 rounds:\n  4 x 25 @ goal 100 pace\n  2 x 50 @ goal 100 pace\n200 easy between rounds',null],
    ['res_4','dryland','Shoulder stability circuit','Band and bodyweight shoulder control.',['dryland','shoulder'],'2-3 rounds: external rotation, serratus wall slide, side plank row',null],
    ['res_5','video','Streamline alignment','Short technique reference for a tighter line.',['video','underwater'],'','https://www.youtube.com/watch?v=2bPvk0paWcg']
  ].map(([id,type,title,description,tags,content,url])=>({id,type,title,description,tags,content,url}));
  window.createCoachOSDemoData = () => ({
    user:null, week:{start:weekStart,end:weekEnd}, swimmers, workouts,
    tasks:[
      {id:'task_1',swimmer_id:'sw_2',swimmer_name:'Marcus Reed',title:'Check Marcus shoulder note',detail:'Review feedback before the next paddle set.',due_day:iso(now),priority:'high',status:'open',avatar:'./avatars/athlete-2.jpg'},
      {id:'task_2',swimmer_id:'sw_1',swimmer_name:'Nina Park',title:'Publish Nina next week',detail:'Three drafts are ready for a final read.',due_day:iso(now),priority:'normal',status:'open',avatar:'./avatars/athlete-1.jpg'},
      {id:'task_3',swimmer_id:'sw_7',swimmer_name:'Sarah Kim',title:'Adjust Sarah dryland',detail:'Modify jumping while ankle is restricted.',due_day:iso(addDays(now,1)),priority:'high',status:'open',avatar:'./avatars/athlete-1.jpg'}
    ], conversations, messages, resources
  });
})();
