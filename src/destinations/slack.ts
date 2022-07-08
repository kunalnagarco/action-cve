import { ACTION_ICON, ACTION_SHORT_SUMMARY } from '../constants'
import { Alert } from '../entities'
import { IncomingWebhook } from '@slack/webhook'
import { KnownBlock } from '@slack/types'

const createSummaryBlock = (
  alertCount: number,
  repositoryName: string,
  repositoryOwner: string,
): KnownBlock => {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `You have ${alertCount} vulnerabilities in *${repositoryOwner}/${repositoryName}*`,
    },
  }
}

const createDividerBlock = (): KnownBlock => {
  return {
    type: 'divider',
  }
}

const createAlertBlock = (alert: Alert): KnownBlock => {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sollicitudin, augue ac finibus tincidunt, diam quam tincidunt quam, id ultrices ligula lectus eget lectus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ac tortor at orci ultrices molestie. Ut suscipit urna quis quam tristique, quis eleifend est semper. Morbi ut urna egestas ipsum efficitur sagittis eu at sapien. Duis convallis euismod ligula vel laoreet. Proin sed hendrerit justo. Curabitur fringilla porttitor diam id porttitor. Nunc ex magna, fringilla in nunc in, aliquet faucibus dolor. Etiam vitae ipsum malesuada, scelerisque enim quis, egestas risus. Suspendisse eget nunc vitae urna elementum feugiat. Vivamus scelerisque metus nec dui maximus, eu sagittis nunc consectetur. Aliquam a felis sit amet leo hendrerit gravida et imperdiet nulla. Cras facilisis eleifend metus, ac pellentesque tortor pulvinar nec. Mauris id gravida ante, eu bibendum nisi. Nunc gravida diam a lacus elementum mattis.

      Nullam ornare lobortis augue, quis fringilla tellus aliquet vel. Donec ac tellus eros. Donec efficitur libero ut ipsum consectetur iaculis. Suspendisse potenti. Donec mollis vehicula mattis. Vivamus malesuada euismod turpis ac efficitur. Quisque commodo orci turpis, id blandit urna sodales eu. Maecenas accumsan posuere augue, ac pulvinar sem semper efficitur. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque viverra hendrerit tellus quis luctus.

      In condimentum condimentum nisl quis dapibus. Nunc feugiat nisi nec leo finibus efficitur. Etiam vitae viverra lorem, id ornare purus. Mauris sed eros auctor, varius ante sed, tincidunt tortor. Sed tincidunt fringilla lorem sit amet semper. Sed quis malesuada eros. Praesent ex turpis, semper vel ex non, scelerisque pharetra odio. Vivamus vulputate arcu nec mollis congue. Suspendisse quis risus finibus, molestie velit id, scelerisque est. Curabitur eu iaculis nunc. Nullam ac justo ac dolor gravida interdum. Phasellus non consequat lectus.

      Duis purus ante, accumsan sed justo ut, posuere mattis ipsum. Curabitur blandit non massa pellentesque rutrum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In quis felis nunc. Nam hendrerit urna vel felis malesuada mattis. Mauris congue ornare tellus, et accumsan leo fringilla sed. Fusce egestas aliquet lectus, euismod feugiat lectus tempus in. Nam eleifend lacus in velit tempor, rhoncus venenatis sem tempus. Donec vestibulum vestibulum euismod. Aliquam gravida tortor eget justo tempus tincidunt. Maecenas efficitur ut ex vel viverra.

      Ut quis sodales felis. Nullam id dolor rhoncus, placerat magna ac, egestas risus. Vivamus varius lacus vel erat sodales, quis tincidunt nisl viverra. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris nec dolor sem. Proin cursus, urna at tincidunt vestibulum, tortor eros elementum metus, non vehicula velit magna ac felis. Aenean sed dolor luctus nulla dictum interdum sed nec purus. Donec et accumsan mi. Etiam et libero suscipit, posuere odio id, lobortis leo. Sed finibus, sem vel placerat tempor, nulla tortor varius mauris, sit amet semper neque velit sed augue. Vivamus ullamcorper dapibus facilisis.

      Nam imperdiet vel lectus et dapibus. Mauris vitae neque quis nunc facilisis porttitor quis non tortor. Nulla facilisi. Duis at tempus tortor. In fermentum efficitur nisi, id feugiat eros pretium a. Nullam eleifend massa in odio aliquet, vel rutrum purus lacinia. Morbi laoreet eu tortor ac commodo. In elementum facilisis eros, et congue libero auctor sit amet.

      Curabitur sodales neque sapien, ornare semper ligula maximus vitae. Maecenas ultricies aliquet luctus. Fusce ut eleifend est. In mollis sagittis tempus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse tempor tortor quis diam congue efficitur. Sed at placerat eros. Praesent erat enim, ornare ut nisi nec, scelerisque aliquam nulla. Sed molestie nibh sit amet mauris cursus elementum.

      Nullam interdum, orci sit amet efficitur pulvinar, metus diam aliquam enim, eu sodales justo turpis et erat. Maecenas vitae est eget ipsum volutpat lacinia ut eget sem. Donec facilisis mauris nisl, a molestie quam venenatis nec. Integer diam urna, finibus nec finibus ut, gravida ac risus. Aliquam erat volutpat. Suspendisse vitae urna et arcu condimentum mattis. Nulla ac augue lobortis, imperdiet mauris in, vehicula justo. Nunc vel tellus ipsum. Aenean gravida arcu eget metus congue, id tristique augue porta. Nam finibus pellentesque ex sed imperdiet. Quisque tincidunt lobortis orci semper placerat. Cras volutpat, mi sed pretium efficitur, velit mi iaculis nisi, id tristique est lacus et turpis. Donec et interdum eros, ac semper odio.

      Maecenas nec diam in ante vulputate imperdiet. Etiam suscipit posuere ipsum, a egestas ex sagittis id. Duis nulla nulla, posuere at faucibus nec, porttitor ac nisi. Ut id felis neque. Fusce lobortis convallis eros et elementum. Fusce sagittis sit amet ipsum ut vestibulum. Sed quis dictum dolor. Nullam fringilla aliquam arcu ac finibus. Quisque non velit augue. Donec interdum aliquam metus non varius. Suspendisse vitae tempus elit, vitae molestie eros.

      Vestibulum id urna non enim dictum pretium. Cras id varius felis, eu facilisis eros. Quisque aliquet leo pretium ipsum tincidunt interdum. Suspendisse quis congue risus. Nullam et velit et mauris ullamcorper pulvinar ac ut purus. Fusce non bibendum est, sed commodo magna. Proin gravida, arcu malesuada tristique sagittis, arcu metus laoreet nibh, id molestie justo arcu fringilla tortor. Suspendisse viverra urna eros, at feugiat ipsum porttitor eu. In in risus nisi. Aliquam a purus ut mauris placerat tempor ut eleifend velit. Vivamus tincidunt dui vitae nibh finibus, ac ultrices lectus condimentum. Fusce ut consequat velit. Nulla sapien risus, blandit in venenatis in, euismod sed eros. Mauris placerat erat vitae egestas auctor. Fusce commodo ipsum velit. Morbi non elit purus.

      Morbi ultricies sapien vitae ipsum hendrerit, sed malesuada erat fringilla. Donec nec lorem ut nunc faucibus blandit eget nec nisl. Mauris fermentum vitae arcu et cursus. In maximus arcu ut sagittis vestibulum. Fusce interdum venenatis justo at vehicula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam ultrices sed nunc eu aliquet. Curabitur aliquam, ante id vehicula rutrum, odio leo vehicula neque, non egestas massa enim ac ligula. Aenean malesuada est eget neque vestibulum, sit amet sodales ante iaculis. Donec quis pellentesque augue. Nullam non consectetur mi. Nullam felis nulla, tempus nec convallis vitae, dignissim sit amet nunc. Aenean lobortis imperdiet dui, quis egestas lorem dapibus eu. Vivamus fringilla orci a diam lacinia, vel cursus tortor cursus. Suspendisse ultricies, ipsum a commodo porttitor, tellus ligula volutpat nisi, eu tincidunt velit ex id ante. Nulla consequat tincidunt purus, sit amet bibendum purus scelerisque ut.

      Quisque ac fringilla turpis. Nulla sit amet risus vel ante interdum lobortis. Phasellus in purus sed eros dignissim egestas at quis quam. In tempor tincidunt diam a laoreet. Nulla porttitor pellentesque erat non lacinia. Mauris ac lacus nibh. Quisque et velit hendrerit lacus consequat malesuada. Nulla tristique lorem quis sapien dictum, quis pharetra diam porta. Cras dictum arcu eget mollis tempor. Donec eget vestibulum tortor. Aenean efficitur convallis lorem, a vestibulum est eleifend et. Donec ut ipsum viverra, lacinia ipsum sed, fringilla nunc. Nunc non lacus viverra ante condimentum tincidunt et in nisl. Etiam mattis elementum ante, vitae sodales turpis ultrices ut. Vivamus faucibus viverra lectus, ac fermentum ex efficitur vitae.

      Donec at nisi lacus. Nullam finibus suscipit leo, in gravida ante malesuada ac. Duis porta sollicitudin neque a egestas. Maecenas nisl eros, bibendum sit amet tristique sed, vehicula ac ex. Aenean nulla odio, accumsan eu porttitor vel, pretium eget lorem. In eu mollis arcu. Curabitur in consequat leo. Sed nec libero nibh. Mauris porttitor quis enim eget congue.

      Ut nec urna nec risus porta rhoncus id eu risus. Ut ac semper libero. Ut blandit varius condimentum. Nam ut dolor quis dolor vestibulum gravida. Proin at volutpat ante. Praesent commodo, ipsum condimentum gravida laoreet, leo mi finibus neque, vel feugiat massa urna in dolor. Maecenas posuere eros non ipsum vulputate venenatis. Ut commodo leo sem, nec fermentum sapien finibus ut. Phasellus eget ultricies ante. Sed pretium lacus at erat euismod elementum. Nam imperdiet est sed diam maximus, ut molestie leo sodales. Integer eu felis a mi varius porttitor eu a leo. Duis varius vulputate massa, in sollicitudin libero rhoncus in. Duis sem erat, maximus eget nisl in, aliquam consequat velit.

      Curabitur rhoncus, massa ut ultricies interdum, ipsum risus pretium metus, id imperdiet ligula justo eget justo. Etiam vehicula facilisis odio nec sodales. Nam elit libero, consectetur vitae egestas eget, pellentesque id odio. Suspendisse vel finibus enim. Curabitur feugiat, turpis placerat tristique vulputate, velit nibh tincidunt ex, id pellentesque purus justo eu leo. Curabitur varius consequat magna id pretium. Mauris feugiat elit id egestas interdum. Phasellus tellus metus, commodo a neque sed, iaculis iaculis eros. Suspendisse viverra quam in dapibus vehicula. Proin finibus augue et nunc luctus rhoncus. Nulla hendrerit sodales orci, eget malesuada nibh lobortis vel. Nulla non diam iaculis, ultricies neque sit amet, tempus eros. Fusce aliquam lectus libero, eget consectetur ipsum ultricies at.

      Fusce ut lorem a massa dictum pretium. Nulla convallis fringilla vulputate. Suspendisse potenti. Duis orci dui, ultricies et ante a, egestas semper purus. Cras tortor nibh, dictum non risus sit amet, accumsan laoreet felis. Morbi maximus viverra eleifend. Suspendisse potenti. Proin dolor leo, pulvinar imperdiet vehicula egestas, rhoncus non tortor. Aliquam sit amet pellentesque elit. Quisque posuere tellus sit amet vulputate convallis.

      Suspendisse id metus felis. Duis non lectus est. Aenean sit amet dignissim magna. Fusce ac finibus nibh. Aenean nibh ante, dapibus sed varius ut, facilisis quis arcu. Morbi non nunc leo. Donec leo tellus, lacinia ultricies lobortis at, condimentum a purus. Nunc ut placerat tortor. Vestibulum dignissim, lorem quis varius semper, neque dui tincidunt nisi, et efficitur nisi dolor quis neque. Nulla ut leo sit amet lorem tincidunt facilisis id quis purus. Quisque dictum egestas lorem nec aliquet.

      Morbi ullamcorper justo in felis ornare ullamcorper. Proin varius porta egestas. Fusce in urna dolor. Etiam imperdiet sed diam non blandit. In posuere eros nec lacus congue molestie. Pellentesque nec nisl purus. Nulla et ullamcorper est, in varius risus. In efficitur dui in nulla sagittis pretium. Morbi egestas nulla leo, scelerisque placerat nisi ultrices consequat. Cras sodales aliquam leo, eu dignissim nisi sagittis sit amet. Vivamus pellentesque, turpis eget eleifend porttitor, risus sapien tincidunt ipsum, rutrum bibendum nulla lorem ac magna. Duis semper faucibus risus sit amet dapibus. Proin eleifend dui at elit blandit dignissim. Aliquam libero nisl, molestie at gravida in, semper sit amet nunc. Cras erat sem, porta nec eros nec, egestas maximus arcu.

      Nulla egestas nunc sit amet fringilla porttitor. Ut bibendum elit sit amet metus vestibulum pretium. Ut tempus risus tortor, vel gravida dolor ornare id. Etiam iaculis arcu ullamcorper diam vulputate, pellentesque maximus sapien ornare. Praesent neque elit, tempus eu accumsan quis, venenatis quis risus. Phasellus sagittis tristique lacus a pretium. Quisque volutpat aliquam ipsum, ac tristique massa sagittis nec. Sed malesuada dui vitae leo cursus sagittis. Etiam blandit elementum justo, mattis placerat magna placerat id. Aliquam id malesuada eros. Duis placerat fringilla facilisis. Aenean purus dui, condimentum quis varius nec, blandit eu enim. Morbi nec purus semper, condimentum arcu quis, varius nunc. Sed convallis rutrum accumsan.

      Curabitur eu lorem non quam egestas feugiat. Etiam id massa pulvinar, imperdiet dui lacinia, cursus ligula. Curabitur a ex neque. Ut ipsum leo, congue quis varius a, condimentum quis enim. Sed nec dignissim quam. Proin ornare purus pellentesque velit aliquet euismod. Sed fermentum metus sit amet neque mattis viverra. Etiam fermentum lacus at nisi pharetra, eu malesuada quam dapibus. Ut consequat auctor arcu a elementum. Nunc molestie porttitor lorem facilisis tristique. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer in bibendum tellus, quis lobortis orci. Duis tempus varius nisl, sed lacinia dolor dictum vitae. Duis at justo lacinia, auctor ante eu, volutpat purus.

      Quisque ac sodales leo. Sed sit amet euismod tortor. Phasellus sit amet sagittis lectus. Quisque tincidunt vehicula odio, vel vehicula lacus lacinia vel. Sed sit amet eros velit. Donec vestibulum lectus quis vehicula fringilla. Curabitur condimentum ipsum et erat scelerisque dictum. Praesent eu aliquam quam. Sed mattis fringilla justo, a pretium nulla sollicitudin sodales. Donec elementum rhoncus lacinia. Nam ut est et lorem laoreet varius. Morbi orci nulla, molestie in orci et, sagittis rhoncus diam.

      Integer in tellus et ante ultrices eleifend et eu urna. Sed rhoncus nunc tellus, quis elementum sapien congue at. Aliquam vehicula hendrerit ex, id imperdiet erat condimentum quis. Donec at luctus elit. Cras et felis nec augue rhoncus blandit. Cras suscipit, leo eu vulputate fermentum, libero enim consequat nisi, vitae venenatis diam sapien a quam. Aliquam eget odio quis magna feugiat ultricies pretium at mauris. Suspendisse a ex quis turpis bibendum rutrum. Nunc mollis arcu et risus gravida, vel porttitor lectus dapibus. Vestibulum efficitur dui auctor velit mattis, nec mattis diam aliquam. Suspendisse in tincidunt dolor, vel malesuada eros. Cras viverra sem libero, eget eleifend justo commodo vel. Donec condimentum, velit a sodales accumsan, enim nisi condimentum massa, ac malesuada lorem nisl id est. Duis dignissim tortor purus. Nulla laoreet ex in sem pharetra, eget fringilla orci rutrum. Ut ut nisi ac ligula iaculis porttitor at sit amet arcu.

      Maecenas varius quam ut ante placerat, a laoreet erat condimentum. Aenean eleifend massa vitae massa sagittis, sit amet varius elit suscipit. Nam sem orci, laoreet eget velit et, posuere elementum nunc. Sed scelerisque, mauris eget convallis sollicitudin, risus orci mollis nibh, dictum consectetur ipsum justo in ipsum. Nulla fermentum ante in dui congue, non facilisis lectus pretium. Nunc augue leo, convallis sed turpis ut, ultrices pellentesque nisi. Aenean tincidunt et diam sit amet accumsan. Proin congue tellus id nibh suscipit rutrum. Fusce pretium id mi id tincidunt. Duis pharetra, neque sit amet bibendum condimentum, nibh nulla eleifend nisi, vitae convallis elit orci et sapien. Donec sagittis efficitur sem, rhoncus viverra sapien placerat vitae. Fusce eleifend quis dui eget sodales. Maecenas sed tincidunt ipsum, sit amet venenatis tortor.

      Quisque sit amet leo et nibh pharetra euismod. Nam vehicula ultricies sapien. Cras vel dolor porttitor, gravida ante eget, luctus erat. Etiam scelerisque lectus nulla, ac lobortis ante scelerisque sed. Aenean sagittis facilisis diam congue suscipit. Nam lacinia blandit semper. Sed viverra eget nulla ac mollis. Suspendisse scelerisque risus ac tortor mattis, in varius nisi ornare. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Phasellus in condimentum quam. Etiam varius euismod urna, sed placerat diam tristique ac.

      Nulla finibus, enim et scelerisque vestibulum, velit nisi condimentum urna, nec vestibulum lacus turpis et nibh. Morbi purus dui, sodales vitae fermentum et, tempor quis justo. Vestibulum posuere eleifend dolor ac sodales. Proin eget suscipit leo. Nunc arcu nunc, tincidunt a ipsum nec, rhoncus accumsan turpis. Cras pharetra libero a risus faucibus fermentum. Nullam sollicitudin semper viverra. Phasellus congue sapien et efficitur sodales.

      Nulla a nibh a diam scelerisque maximus. In hac habitasse platea dictumst. Sed ultrices efficitur rutrum. Ut maximus hendrerit justo, a ornare neque. Ut viverra urna neque, vitae auctor massa condimentum quis. Vestibulum est felis, fringilla eu massa in, condimentum fermentum magna. Praesent non vestibulum velit, ac luctus nibh. Duis sit amet ipsum a ex convallis malesuada vitae in mi.

      Aliquam molestie est ligula, sed placerat turpis varius quis. Quisque dui erat, venenatis sed hendrerit quis, vestibulum non nisl. Nam vel libero arcu. In ante nibh, sollicitudin consectetur sodales id, maximus non tortor. Vivamus interdum efficitur leo. Mauris mollis lectus vitae dolor pretium, quis vehicula orci blandit. Cras eu ornare libero. Mauris blandit ultricies erat, sodales venenatis quam efficitur eu. Mauris metus orci, ultrices vitae commodo eget, scelerisque id enim. Ut rhoncus urna ut dapibus vulputate. Maecenas pulvinar porttitor lorem, nec efficitur arcu tempus a. Suspendisse potenti. Morbi sagittis scelerisque lectus nec vestibulum. In ut tortor libero. Aliquam mollis libero viverra elit mattis, id tempor sapien vestibulum. Curabitur fermentum sagittis purus, sed faucibus lectus elementum et.

      Cras vulputate pulvinar orci vitae sollicitudin. Fusce a mauris scelerisque, auctor nibh eu, auctor neque. Nam mollis, magna ut ullamcorper tempor, risus lectus ullamcorper mi, sit amet aliquam lacus sem id dolor. Donec at pretium arcu, tincidunt tristique quam. Aenean id turpis venenatis, ultricies justo et, convallis nisl. Suspendisse porttitor non nisi vel blandit. Pellentesque dapibus est enim, ac efficitur nulla dapibus nec.

      Quisque tristique quam orci, in eleifend odio dapibus eu. Nulla erat lorem, sodales et dignissim at, consectetur sed augue. Aenean mi libero, tempus nec blandit sodales, tempus non enim. Cras suscipit velit in est porta fermentum. Integer eget nulla quam. Nam eget urna tempor odio condimentum efficitur non ullamcorper dui. Ut aliquam eros vel nulla malesuada, commodo lobortis arcu porttitor. Proin eget nisi diam. Vestibulum nec maximus dui, sed tristique urna. Aliquam egestas, mauris et rutrum placerat, risus ligula varius urna, et lobortis est odio vitae risus. Duis metus ligula, faucibus et semper et, facilisis vitae leo. Nam eget dolor rutrum, bibendum lectus in, tincidunt neque. Morbi vitae leo turpis. Maecenas fringilla sapien ligula, id luctus nisi facilisis lacinia. Curabitur cursus, augue pulvinar hendrerit rutrum, eros orci accumsan erat, et ornare magna magna sed libero. Proin condimentum elit quis dui pulvinar, ut fermentum felis rhoncus.

      Sed tempor dui odio. Cras sagittis aliquet lacus. Vivamus consequat, lorem id efficitur suscipit, sem libero tincidunt ligula, vel blandit lacus neque eu lectus. Suspendisse potenti. Aliquam non massa risus. Donec nec dui bibendum, feugiat magna vitae, posuere ligula. Fusce pretium efficitur massa, venenatis tristique arcu. Curabitur vehicula sed risus sed congue.

      Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus sit amet massa in ligula posuere rutrum. Etiam vel euismod nunc. Vivamus rhoncus enim ullamcorper nulla cursus rutrum. Integer euismod lorem ut sodales mollis. Proin hendrerit erat nec elit aliquet, id tincidunt diam efficitur. Morbi mattis justo sed odio suscipit molestie. Fusce vel commodo urna. Suspendisse efficitur consectetur ipsum, eu ornare urna luctus et. Ut quis tincidunt dui.

      Suspendisse aliquam luctus venenatis. Maecenas pharetra, metus id vehicula vehicula, felis urna rutrum mauris, lacinia dictum lacus massa sed ligula. Mauris rutrum neque porta, ultrices magna sagittis, congue orci. Sed non purus posuere, ultricies nulla eget, tincidunt leo. Etiam in facilisis enim. Phasellus imperdiet, odio ac ornare tempor, turpis sem eleifend arcu, posuere convallis urna justo sed diam. Etiam congue aliquet ipsum ac condimentum. Praesent pretium interdum urna, a viverra nibh porta quis. Aenean nec nisl sodales, cursus mi vitae, pulvinar quam.

      Nam viverra faucibus risus ac dapibus. Pellentesque quis fringilla libero. Sed volutpat imperdiet nunc id vulputate. Nulla eget magna vitae ligula dignissim posuere. Etiam ac mauris lacus. Praesent eget feugiat nisi, a dignissim risus. Donec egestas nibh eget scelerisque consectetur. Mauris bibendum pellentesque purus, nec luctus dui mollis at. Aliquam nec arcu lobortis, varius nibh ac, bibendum turpis. Suspendisse at egestas nisl. In interdum, erat in tincidunt pretium, est enim porttitor nisl, id rutrum nisi purus dapibus augue. Aliquam sagittis sit amet nibh ut efficitur.

      Aenean eu auctor orci, mattis congue eros. Nulla laoreet sagittis eros non pretium. Pellentesque vulputate facilisis ex nec iaculis. In a nisi rutrum, tristique neque quis, ornare nisl. Morbi quis erat feugiat, porttitor velit sed, ultrices enim. Duis purus dui, porttitor sed tortor et, sagittis malesuada tellus. Aliquam erat volutpat. Nullam eget libero eget libero iaculis rutrum a vel quam. Etiam eros neque, luctus eget lacinia ut, commodo sed mi. Cras lacinia orci libero, ut faucibus sapien tristique vel. Maecenas nec quam eu orci viverra blandit. Nam aliquam, nisl id commodo pretium, eros eros cursus arcu, vitae maximus justo massa sed enim. Sed sit amet eros sed mi sagittis viverra.

      Proin ut tempor neque. Vivamus tristique arcu purus, at mollis velit ultricies in. Vivamus vitae dapibus sapien. Aliquam dui nisl, egestas eu arcu at, ullamcorper egestas nisl. Aenean laoreet neque nulla, non iaculis nunc tristique a. Mauris interdum, dui vitae finibus ullamcorper, nisi metus facilisis est, volutpat maximus erat dolor vel mauris. Phasellus ornare finibus diam, non varius risus commodo vel. Phasellus quis odio id lorem faucibus feugiat ut non metus. Cras lacus elit, condimentum quis tristique id, tempus eget lectus. In vel dui finibus, facilisis turpis sed, blandit libero. Ut dapibus diam augue, sit amet aliquet enim tempor sit amet. Vestibulum faucibus sollicitudin pellentesque. Mauris convallis libero et dictum convallis. Aliquam erat volutpat. Sed eu sapien at ex tincidunt aliquet tincidunt venenatis sapien. Quisque ut blandit ex.

      Proin viverra aliquet gravida. Morbi efficitur risus et nulla hendrerit, in tincidunt erat euismod. Ut facilisis sagittis lorem. Donec non risus nec velit ornare feugiat. Duis mollis mauris eget mauris tincidunt, non congue sapien vehicula. Ut bibendum, massa ut mollis vehicula, mauris odio maximus nisi, a varius dui quam nec sapien. Phasellus in interdum mi.

      Fusce sed tristique nisi. Duis laoreet ipsum non neque faucibus, eu aliquet sem porta. Donec quis fermentum lacus. Duis malesuada a quam et dignissim. Vestibulum pharetra ligula a placerat finibus. Morbi placerat, ante et feugiat consectetur, nulla nunc feugiat mi, ut placerat purus ante non felis. Vestibulum molestie ornare aliquam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla eu lacus felis. Donec vel sodales enim. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam vel augue vel magna rutrum cursus non quis elit. In vitae nisi in leo lobortis egestas a ac risus. Mauris tortor nulla, sodales sed massa sed, ultricies facilisis mauris.

      Duis porta sapien non odio vestibulum, sed vehicula libero pulvinar. Maecenas eleifend tempus dolor et sollicitudin. Donec eleifend porta vehicula. Integer urna nisi, porttitor et turpis sit amet, semper fermentum lacus. Maecenas hendrerit lorem non ligula vestibulum rhoncus. Praesent libero sem, sodales non pellentesque vitae, aliquam nec dolor. Vestibulum et elementum dui. Aliquam at ipsum rhoncus, lobortis libero vitae, gravida diam. Curabitur ac est nulla. Phasellus in nibh sed purus semper blandit dictum hendrerit orci. Duis eget sapien mattis, auctor mauris vitae, porttitor nisl. Ut eu tristique tellus. Suspendisse potenti.

      Proin pulvinar leo metus, nec facilisis lectus lobortis vitae. Nullam non lobortis est, vel sodales erat. Cras et lacus egestas, ultricies elit et, faucibus nulla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus tortor vel lacus placerat, a accumsan justo dignissim. Mauris vitae mauris blandit, dapibus mi eget, accumsan sapien. Duis at magna et leo porttitor tristique. Mauris eu velit in odio cursus ullamcorper at sit amet lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ut euismod elit. Praesent blandit massa id tincidunt fermentum. Donec scelerisque faucibus purus.

      Nulla ac ultricies nisi. Sed euismod sagittis dolor ac rutrum. Quisque a vehicula ex, id feugiat sapien. Nullam bibendum elit ut sapien molestie eleifend. Integer mattis id purus ac viverra. Sed rhoncus quam id turpis faucibus, vel gravida odio vestibulum. Nam vulputate tellus justo, ut tincidunt felis auctor a. Proin finibus, urna in posuere eleifend, lorem erat ullamcorper urna, ut commodo ligula nibh a turpis. Sed eleifend, dui at sollicitudin mollis, orci felis tristique turpis, a dapibus eros nisl quis arcu. Proin mattis elementum eleifend. Maecenas dictum quam ac sapien interdum fermentum in in dui.

      Vivamus rutrum ut lorem sed laoreet. Suspendisse euismod nunc mauris, at maximus risus mattis eu. Mauris eleifend rhoncus odio, eget blandit arcu molestie ullamcorper. Sed enim odio, rhoncus sit amet massa sit amet, blandit vestibulum tellus. Mauris iaculis erat ac lobortis viverra. Vivamus feugiat non orci vel rhoncus. Sed eget ex vitae ante lacinia auctor in at dolor. Etiam sit amet finibus ante. Ut molestie magna non velit cursus tempus. Pellentesque et sem fringilla diam viverra feugiat. Aliquam varius nunc non arcu aliquam dictum. Etiam porttitor egestas nisl eget rhoncus. Praesent ultricies sollicitudin mattis.

      Mauris hendrerit nibh placerat, luctus leo ut, imperdiet leo. Praesent quis lorem fringilla, blandit dui sed, commodo metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris congue purus eget feugiat suscipit. Sed et posuere ligula. Nullam hendrerit vel mauris vel efficitur. Integer feugiat lectus lectus, vel rhoncus lacus pretium ut. Duis vulputate pulvinar molestie. Etiam condimentum iaculis mauris, vitae consequat eros congue quis. Integer ac metus vitae sem bibendum molestie porta nec libero. Nulla eget vestibulum nunc. Nam quis erat fermentum, imperdiet quam nec, aliquet justo.

      Duis a suscipit turpis. In cursus elit leo, vel imperdiet diam scelerisque ac. Etiam semper congue massa eu dignissim. Nunc tempus eros gravida dui dignissim, at semper turpis facilisis. Ut lacinia, purus vitae ultrices ullamcorper, diam ante commodo risus, sodales porta erat ligula ut magna.
            `,
    },
    accessory: {
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'View Advisory',
        emoji: true,
      },
      style: 'danger',
      url: alert.advisory?.url,
    },
  }
}

export const validateSlackWebhookUrl = (url: string): boolean => {
  const regexPattern = new RegExp(
    /^https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]{8,10}\/B[a-zA-Z0-9_]{10}\/[a-zA-Z0-9_]{24}/,
  )
  return regexPattern.test(url)
}

export const sendAlertsToSlack = async (
  webhookUrl: string,
  alerts: Alert[],
): Promise<void> => {
  const webhook = new IncomingWebhook(webhookUrl)
  const alertBlocks: KnownBlock[] = []
  for (const alert of alerts) {
    alertBlocks.push(createAlertBlock(alert))
  }
  await webhook.send({
    blocks: [
      createSummaryBlock(
        alerts.length,
        alerts[0].repository.name,
        alerts[0].repository.owner,
      ),
      createDividerBlock(),
      ...alertBlocks,
    ],
    icon_url: ACTION_ICON,
    username: ACTION_SHORT_SUMMARY,
  })
}
