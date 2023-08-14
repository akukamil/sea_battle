var M_WIDTH=450, M_HEIGHT=800;
var app, game_res, gdata={},fbd,  game, client_id, objects={}, state='',git_src='',chat_path, my_role="", game_tick=0, game_id=0, my_turn=0, connected = 1, LANG = 0;
var h_state=0, game_platform='', hidden_state_start = 0, room_name = 'states';
var pending_player="",some_process = {};
var my_data={opp_id : ''},opp_data={};
const FIELD_X_CELLS=9, FIELD_Y_CELLS=11,CELL_SIZE=50, WIN = 1, DRAW = 0, LOSE = -1, NOSYNC = 2,MONEY_BONUS=3;

irnd = function(min,max) {	
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const rgb_to_hex = (r, g, b) => '0x' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

class player_mini_card_class extends PIXI.Container {

	constructor(x,y,id) {
		super();
		this.visible=false;
		this.id=id;
		this.uid=0;
		this.type = 'single';
		this.x=x;
		this.y=y;
		
		
		this.bcg=new PIXI.Sprite(game_res.resources.mini_player_card_online.texture);
		this.bcg.width=150;
		this.bcg.height=190;
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){lobby.card_down(id)};
		
		this.table_rating_hl=new PIXI.Sprite();
		this.table_rating_hl.width=210;
		this.table_rating_hl.height=100;
		
		this.avatar=new PIXI.Sprite();
		this.avatar.x=35;
		this.avatar.y=40;
		this.avatar.width=this.avatar.height=70;
		
		this.avatar_frame=new PIXI.Sprite(gres.mini_player_card_frame.texture);
		this.avatar_frame.x=25;
		this.avatar_frame.y=30;
		this.avatar_frame.width=this.avatar_frame.height=90;
		
		this.table_frame=new PIXI.Sprite(gres.table_card_frame.texture);
		this.table_frame.x=10;
		this.table_frame.y=40;
		this.table_frame.width=this.table_frame.height=120;
				
		this.name="";
		this.t_name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 22,align: 'center'});
		this.t_name.anchor.set(0.5,0.5);
		this.t_name.x=70;
		this.t_name.y=25;
		this.t_name.tint=0xffffff;		

		this.rating=0;
		this.t_rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 40,align: 'center'});
		this.t_rating.tint=0xffff00;
		this.t_rating.anchor.set(0.5,0.5);
		this.t_rating.x=70;
		this.t_rating.y=150;		
		this.t_rating.tint=0x333300;

		//аватар первого игрока
		this.avatar1=new PIXI.Sprite();
		this.avatar1.x=20;
		this.avatar1.y=50;
		this.avatar1.width=this.avatar1.height=60;

		//аватар второго игрока
		this.avatar2=new PIXI.Sprite();
		this.avatar2.x=60;
		this.avatar2.y=70;
		this.avatar2.width=this.avatar2.height=60;
		
		this.t_rating1=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 35,align: 'center'});
		this.t_rating1.tint=0x555500;
		this.t_rating1.anchor.set(0.5,0.5);
		this.t_rating1.x=70;
		this.t_rating1.y=25;

		this.t_rating2=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 35,align: 'center'});
		this.t_rating2.tint=0x555500;
		this.t_rating2.anchor.set(0.5,0.5);
		this.t_rating2.x=70;
		this.t_rating2.y=155;
		
		
		this.name1="";
		this.name2="";

		this.addChild(this.bcg,this.avatar, this.avatar1, this.avatar2,this.t_rating,this.t_rating1,this.t_rating2, this.t_name,this.table_frame,this.avatar_frame);
	}

}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(game_res.resources.lb_player_card_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.width = 370;
		this.bcg.height = 70;

		this.place=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.place.tint=0xffff00;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=10;
		this.avatar.width=this.avatar.height=48;


		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.name.tint=0xdddddd;
		this.name.x=105;
		this.name.y=22;


		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.rating.x=298;
		this.rating.tint=rgb_to_hex(255,242,204);
		this.rating.y=22;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}


}

class feedback_record_class extends PIXI.Container {
	
	constructor() {
		
		super();		
		this.text=new PIXI.BitmapText('Николай: хорошая игра', {lineSpacing:50,fontName: 'mfont',fontSize: 20,align: 'left'}); 
		this.text.maxWidth=290;
		this.text.tint=0xFFFF00;
		
		this.t_name=new PIXI.BitmapText('Николай:', {fontName: 'mfont',fontSize: 20,align: 'left'}); 
		this.t_name.tint=0xFFFFFF;
		
		
		this.addChild(this.text,this.t_name)
	}		
	
	set(name, feedback_text){
		this.text.text=name+': '+feedback_text;
		this.t_name.text=name+':';
	
	}
	
	
}

class cell_class extends PIXI.Container{
	
	constructor() {
		
		super();
		
		this.ship_part=new PIXI.Sprite(gres.ship1_img.texture);
		this.ship_part.width=60;
		this.ship_part.height=60;
		this.ship_part.anchor.set(0.5,0.5);
		this.ship_part.visible=false;
		this.ship_part.alpha=0.85;
		
		this.other_icon=new PIXI.Sprite(gres.miss_img.texture);
		this.other_icon.width=60;
		this.other_icon.height=60;
		this.other_icon.anchor.set(0.5,0.5);
		this.other_icon.visible=false;		
		
		this.ship_id=-1;
		this.type='';
		this.bonus_type='';
		
		this.addChild(this.ship_part,this.other_icon);
		
	}	
}

class field_class extends PIXI.Container{
	
	constructor() {
		
		super();	
				
		this.bcg = new PIXI.Sprite(gres.field_bcg.texture);
		this.bcg.width=490;
		this.bcg.height=580;
		this.addChild(this.bcg);
		this.ships=[];
		
		this.bonus_bcg=new PIXI.Sprite(gres.bonus_bcg.texture);
		this.bonus_bcg.anchor.set(0.5,0.5);
		this.bonus_bcg.visible=false;
		this.addChild(this.bonus_bcg);
		
		this.ready=true;
		
		//создаем массив
		this.map=[];
		for (let y = 0; y <FIELD_Y_CELLS; y++){
			this.map[y]=[];
			for (let x = 0; x <FIELD_X_CELLS; x++){				
				const cell=new cell_class();
				cell.y=y*CELL_SIZE+45;
				cell.x=x*CELL_SIZE+45;
				cell.type='empty';
				this.map[y][x]=cell;
				this.addChild(cell);
			}
		}
		
	}
	
	get_chip_by_pos(y,x){
		
		for (let chip of this.chips)
			if (chip.iy===y&&chip.ix===x)
				return chip;
		
	}
	
	hide_ships(){
		
		for (let y = 0; y <FIELD_Y_CELLS; y++)
			for (let x = 0; x <FIELD_X_CELLS; x++){
				const cell=this.map[y][x];
				if (cell.type==='ship_part')				
					cell.ship_part.visible=false;				
			}
	
	}
	
	show_ship(ship_id){
		
		const pos=this.ships[ship_id].pos;
		
		for(let i=0;i<pos.length;i+=2){
			const py=pos[i];
			const px=pos[i+1];
			this.map[py][px].ship_part.visible=true;
			this.map[py][px].other_icon.texture=gres.ship_part_hited_img.texture;

			this.map[py][px].type='ship_destroyed';
			this.map[py][px].alpha=1;
			anim2.add(this.map[py][px].other_icon,{alpha:[0,1]}, true, 2,'flick');
			
		}
		
	}
	
	set_map(ships_data){
		
		//создаем структуру расположения кораблей
		this.ships=[];		
		for (let i=0;i<ships_data.length;i++){
			const ship=ships_data[i];
			this.ships.push({size:ship.length/2,pos:[],hits:0});			
			for (let p of ship)
				this.ships[i].pos.push(p)			
		}	
		
		//сначала обнуляем всю карту
		for (let y = 0; y <FIELD_Y_CELLS; y++){
			for (let x = 0; x <FIELD_X_CELLS; x++){				
				const cell=this.map[y][x];
				cell.type='empty';
				cell.other_icon.visible=false;
				cell.ship_part.visible=false;
			}
		}
			
		//ячейки карты
		for (let i = 0; i <this.ships.length; i++){
			const ship=this.ships[i];
			const ship_size=ship.size;
			for (let p=0;p<ship.pos.length;p+=2){
				
				const y=ship.pos[p];
				const x=ship.pos[p+1];
				const cell=this.map[y][x];
				
				cell.type='ship_part';
				cell.ship_part.texture=gres['ship'+ship_size+'_img'].texture;
				cell.ship_id=i;
				cell.ship_part.visible=true;
			}		
		}
	}	
	
	all_destroyed(){		
		for (let ship of this.ships){			
			if (ship.hits!==ship.size)
				return false;
		}
		return true;
	}
	
	print_map(){
		
		
		const newArray = this.map.map(arr => arr.map(obj => obj.ship_id));
		console.log(newArray);
	}

}

class armory_element_class extends PIXI.Container{
	
	constructor(){
		
		super();
		this.bomb_name='';
		this.bomb_type='';
		this.bomb_config='';
		this.bcg=new PIXI.Sprite(gres.armory_element_bcg.texture);
		this.bcg.width=gdata.armory_element_bcg_w;
		this.bcg.height=gdata.armory_element_bcg_h;
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		const t=this;
		this.bcg.pointerdown=function(){armory.missile_select(t)};
		
		this.missile=new PIXI.Sprite();
		this.missile.x=gdata.missile_x;
		this.missile.y=gdata.missile_y;
		this.missile.width=gdata.missile_w;
		this.missile.height=gdata.missile_h;
					
		this.missile_param=new PIXI.BitmapText('0', {fontName: 'mfont',fontSize: 30,align: 'center'});
		this.missile_param.anchor.set(0,0.5);
		this.missile_param.x=gdata.missile_param_x;
		this.missile_param.y=gdata.missile_param_y;				
		
		this.missile_num=new PIXI.BitmapText('x10', {fontName: 'mfont',fontSize: 45,align: 'center'});
		this.missile_num.anchor.set(0.5,0.5);
		this.missile_num.x=gdata.missile_num_x;
		this.missile_num.y=gdata.missile_num_y;		
		
		this.selected_frame=new PIXI.Sprite(gres.armory_element_frame.texture);
		this.selected_frame.width=gdata.armory_element_bcg_w;
		this.selected_frame.height=gdata.armory_element_bcg_h;
		this.selected_frame.visible=false;
		
		this.addChild(this.bcg,this.missile,this.missile_param,this.missile_num,this.selected_frame);
		
	}
	
	set(bomb_name){		

		//фиксируем тип и конфигурация
		this.bomb_name=bomb_name;
		
		//получаем тип и конфигурации снаряда
		[this.bomb_type,this.bomb_config]=bomb_name.split('_');
		
				
		if (this.bomb_type==='combo'){
			this.missile.texture=gres.combo_img.texture;
			this.missile_param.text=['Комбо:','Combo:'][LANG]+this.bomb_config.split('').join('-');				
		} else {
			this.missile.texture=gres[bomb_name+'_img'].texture;			
			this.missile_param.text='***'+this.bomb_config;				
		}			

		
		this.missile_num.text='x'+my_data.arms[bomb_name];
		this.visible=true;
		
	}
	
	select(s){

		if (s){
			this.selected_frame.visible=true;
		}else{
			this.selected_frame.visible=false;
		}
	
	}	

}

class shop_card_class extends PIXI.Container{
	
	constructor(id){
		
		super();
		
		this.id=id;
		
		this.bomb_name='';
		
		this.bcg=new PIXI.Sprite(gres.shop_card_bcg.texture);
		this.bcg.width=390;
		this.bcg.height=130;	
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		const t=this;
		this.bcg.pointerdown=function(){shop.buy_down(t)};
		
		
		this.t_price=new PIXI.BitmapText('0', {fontName: 'mfont',fontSize: 35,align: 'center'});
		this.t_price.anchor.set(0,0.5);
		this.t_price.tint=0xffff00;
		this.t_price.rotation=0;
		this.t_price.x=330;
		this.t_price.y=65;	
		
		this.vk_voice=new PIXI.Sprite(gres.vk_voice_img.texture);
		this.vk_voice.anchor.set(0,0.5);
		this.vk_voice.tint=0xffff00;
		this.vk_voice.rotation=0;
		this.vk_voice.x=322;
		this.vk_voice.y=66;	
		this.vk_voice.width=30;
		this.vk_voice.height=30;		
		
		this.t_combo=new PIXI.BitmapText('0', {fontName: 'mfont',fontSize: 38});
		this.t_combo.anchor.set(0,0.5);
		this.t_combo.x=20;
		this.t_combo.y=100;	

		this.t_amount=new PIXI.BitmapText('50', {fontName: 'mfont',fontSize: 40,align: 'center'});
		this.t_amount.anchor.set(0.5,0.5);
		this.t_amount.x=135;
		this.t_amount.y=35;	
		
			

		
		this.addChild(this.bcg,this.t_price,this.vk_voice,this.t_combo,this.t_amount);

	}
	
	update(){
		
		this.t_amount.text=(my_data.arms[this.bomb_name]||0)+['шт','pcs'][LANG];	
		
	}
		
	set(data){
			
			
			
		//получаем тип и конфигурации снаряда
		const [bomb_type,bomb_config]=data.bomb_name.split('_');
		
		this.bomb_name=data.bomb_name;
		
		this.t_combo.text=['Комбо:','Combo:'][LANG]+bomb_config.split('').join('-');		

		this.t_price.text=`+${data.amount}шт/${data.price}`;
		
		if (game_platform==='VK'){
			
			this.vk_voice.visible=true;
			this.t_price.x=240;			
			this.vk_voice.x=this.t_price.x+this.t_price.width-4;	

		}else{
			
			this.vk_voice.visible=false;
			this.t_price.x=245;			
			this.t_price.text+='$';
		}
		
		
		this.t_amount.text=(my_data.arms[data.bomb_name]||0)+['шт','pcs'][LANG];				
	
	}
		
}

map_creator={
	
	proxy_map:null,
		
	check_ship(y,x,orientation,ship_size){
		
		const dx=[0,1][orientation];
		const dy=[1,0][orientation];
		
		//проверяем что корабль помещается в незанятое место
		for (let i=0;i<ship_size;i++){		
			let py=y+dy*i;	
			let px=x+dx*i;
			if (px>FIELD_X_CELLS-1||py>FIELD_Y_CELLS-1||this.proxy_map[py][px]>=0)
				return false;						
		}	
		
		//проверяем свободно ли окружение
		//const dirs=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
		const dirs=[[-1,0],[0,-1],[0,1],[1,0]]
		for (let i=0;i<ship_size;i++){	
			for (let dir of dirs){					
				const py=y+dy*i+dir[0];					
				const px=x+dx*i+dir[1];
				const adj_cell_val=this.proxy_map?.[py]?.[px]
				const not_free=adj_cell_val>-1;
				if (not_free)
					return false;						
			}	
		}
		
		return true;
		
	},
			
	run(ships){		
		
		let ships_data=[];
		
		while(true){
			
			//это выходные данные
			ships_data=[];
			for (let i=0;i<ships.length;i++) ships_data.push([]);
					
			//это только позиции
			this.proxy_map = new Array(FIELD_Y_CELLS);
			for (let i = 0; i < this.proxy_map.length; i++) {
			  this.proxy_map[i] = new Array(FIELD_X_CELLS).fill(-1);
			}				
			
			let ship_id=0;
			for_loop:for (let ship of ships){			
				
				//ищем расположение
				let found=false,x=0,y=0,orientation=0;		
				let start_time=Date.now();
				while(!found){				
					y=irnd(0,FIELD_Y_CELLS-1);				
					x=irnd(0,FIELD_X_CELLS-1);
					orientation=irnd(0,1);
					found=this.check_ship(y,x,orientation,ship);
					if (Date.now()-start_time>500){
						console.log('не нашли начинаем снова')
						break for_loop;						
					}
				}	
				
				//заносим корабль на карту
				const dx=[0,1][orientation];
				const dy=[1,0][orientation];
				for (let i=0;i<ship;i++){		
					const py=y+dy*i;	
					const px=x+dx*i;
					this.proxy_map[py][px]=ship_id;	
					ships_data[ship_id].push(py,px)
				}	
				ship_id++;
			}	
			
			if (ship_id===ships.length)
				return ships_data;
		}
		
		
		
	}		
}

class bullet_class extends PIXI.Sprite{
	
	constructor(){
		
		super();
		this.texture = gres.bullet_img.texture;
		this.width=this.height=CELL_SIZE;
		this.visible=false;		
		this.t=0;
		
		this.dx=0;
		this.dy=0;
		
		this.tx=0;
		this.ty=0;
		
		this.txi=0;
		this.tyi=0;
		
		/*this.p1x=0;
		this.p1y=0;
		
		this.p2x=0;
		this.p2y=0;
		
		this.p3x=0;
		this.p3y=0;*/
		
		this.anchor.set(0.5,0.5);
		
	}
	
	get_deviation_point(ax,ay,bx,by,dev){
				
		const cx=(ax+bx)*0.5;
		const cy=(ay+by)*0.5;
		
		let nx=(cy-ay)*-1;
		let ny=cx-ax;
		const d=Math.sqrt(nx*nx+ny*ny);
		
		this.combo=0;
		
		nx=nx/d;
		ny=ny/d;
		
		return [cx+nx*dev,cy+ny*dev];		

	}
	
	activate(field,syi,sxi,tyi,txi,combo=0){		
		
		this.tyi=tyi;
		this.txi=txi;
		
		this.ty=field.y+45+tyi*CELL_SIZE;
		this.tx=field.x+45+txi*CELL_SIZE;
		
		this.y=field.y+45+syi*CELL_SIZE;
		this.x=field.x+45+sxi*CELL_SIZE;
		
		const dx=this.tx-this.x;
		const dy=this.ty-this.y;	
		const d=Math.sqrt(dx*dx+dy*dy);
		this.dx=dx/d;
		this.dy=dy/d;
		
		this.rotation=Math.atan2(this.dy, this.dx);
		
		this.combo=combo;
		this.visible=true;
		
		this.field=field;

		
	}
	
	process(){
		
		if (this.visible===false) return;
		
		this.x+=this.dx*7;
		this.y+=this.dy*7;
		const dx=this.tx-this.x;
		const dy=this.ty-this.y;	
		const d=Math.sqrt(dx*dx+dy*dy);
		if (d<8){
			this.visible=false;
			game.start_move(this.field,this.tyi,this.txi,this.combo);
		}

		
	}
	
}

anim2 = {
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
	empty_spr : {x:0, visible:false, ready:true, alpha:0},
		
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
		
	
	any_on() {		
		for (let s of this.slot)
			if (s !== null&&s.block)
				return true
		return false;			
	},
	
	linear(x) {
		return x
	},
	
	kill_anim(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj){
					this.slot[i].p_resolve('finished');		
					this.slot[i].obj.ready=true;					
					this.slot[i]=null;	
				}
	
	},
	
	flick(x){
		
		return Math.abs(Math.sin(x*6.5*3.141593));
		
	},
	
	easeOutBack(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	
	easeOutBack2(x) {
		return -5.875*Math.pow(x, 2)+6.875*x;
	},
	
	easeOutElastic(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},
	
	easeOutSine(x) {
		return Math.sin( x * Math.PI * 0.5);
	},
	
	easeOutCubic(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	
	easeInBack(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	
	easeInQuad(x) {
		return x * x;
	},
	
	easeOutBounce(x) {
		const n1 = 7.5625;
		const d1 = 2.75;

		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	},
	
	easeInCubic(x) {
		return x * x * x;
	},
	
	ease2back(x) {
		return Math.sin(x*Math.PI*2);
	},
	
	easeInOutCubic(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	shake(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
		
		
	},	
	
	add (obj, params, vis_on_end, time, func, block=true) {
				
		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);

		let f=0;
		//ищем свободный слот для анимации
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {
				
				obj.visible = true;
				obj.ready = false;

				//добавляем дельту к параметрам и устанавливаем начальное положение
				for (let key in params) {
					params[key][2]=params[key][1]-params[key][0];					
					obj[key]=params[key][0];
				}
				
				//для возвратных функцие конечное значение равно начальному
				if (func === 'ease2back')
					for (let key in params)
						params[key][1]=params[key][0];					
					
				this.slot[i] = {
					obj,
					block,
					params,
					vis_on_end,
					func: this[func].bind(anim2),
					speed: 0.01818 / time,
					progress: 0
				};
				f = 1;
				break;
			}
		}
		
		if (f===0) {
			console.log("Кончились слоты анимации");	
			
			
			//сразу записываем конечные параметры анимации
			for (let key in params)				
				obj[key]=params[key][1];			
			obj.visible=vis_on_end;
			obj.alpha = 1;
			obj.ready=true;
			
			
			return new Promise(function(resolve, reject){					
			  resolve();	  		  
			});	
		}
		else {
			return new Promise(function(resolve, reject){					
			  anim2.slot[i].p_resolve = resolve;	  		  
			});			
			
		}

		
		

	},	
		
	process() {
		
		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {
				
				let s=this.slot[i];
				
				s.progress+=s.speed;		
				
				for (let key in s.params)				
					s.obj[key]=s.params[key][0]+s.params[key][2]*s.func(s.progress);		
				
				//если анимация завершилась то удаляем слот
				if (s.progress>=0.999) {
					for (let key in s.params)				
						s.obj[key]=s.params[key][1];
									
					s.obj.visible=s.vis_on_end;
					if (s.vis_on_end === false)
						s.obj.alpha = 1;
					
					s.obj.ready=true;					
					s.p_resolve('finished');
					this.slot[i] = null;
				}
			}			
		}
		
	},
	
	async wait(time) {
		
		await this.add(this.empty_spr,{x:[0, 1]}, false, time,'linear');	
		
	}
}

sound={
	
	
	on : 1,
	
	play(snd_res) {
		
		if (!this.on||document.hidden)
			return;
		
		if (game_res.resources[snd_res]===undefined)
			return;
		
		game_res.resources[snd_res].sound.play();	
		
	}
	
}

music={
	
	on:1,
	
	activate(){
		
		if (!this.on) return;
	
		if (!gres.music.sound.isPlaying){
			gres.music.sound.play();
			gres.music.sound.loop=true;
		}
	},
	
	switch(){
		
		if (this.on){
			this.on=0;
			gres.music.sound.stop();			
		} else{
			this.on=1;
			gres.music.sound.play();	
		}
		
		objects.pref_music_button.texture=gres[['pref_music_button_off','pref_music_button'][this.on]].texture;

	}
	
}

message={
	
	promise_resolve :0,
	
	add : async function(text, timeout=3000,sound_name='message') {
		
		if (this.promise_resolve!==0)
			this.promise_resolve("forced");
		
		
		//воспроизводим звук
		sound.play(sound_name);

		objects.message_text.text=text;

		await anim2.add(objects.message_cont,{y:[-50,objects.message_cont.sy]}, true, 0.25,'linear',false);

		let res = await new Promise((resolve, reject) => {
				message.promise_resolve = resolve;
				setTimeout(resolve, timeout)
			}
		);
		
		if (res === "forced")
			return;

		anim2.add(objects.message_cont,{y:[objects.message_cont.y, -50]}, false, 0.25,'linear',false);			
	},
	
	clicked : function() {
		
		
		message.promise_resolve();
		
	}

}

big_message={
	
	p_resolve : 0,
	
		
	show: function(t1,t2) {
						
		if (t2!==undefined || t2!=="")
			objects.big_message_text2.text=t2;
		else
			objects.big_message_text2.text='**********';

		objects.big_message_text.text=t1;
		anim2.add(objects.big_message_cont,{scale_y:[0,1]}, true, 0.15,'linear');		
				
		return new Promise(function(resolve, reject){					
			big_message.p_resolve = resolve;	  		  
		});
	},

	close : function() {
		
		if (objects.big_message_cont.ready===false)
			return;

		anim2.add(objects.big_message_cont,{scale_y:[1,0]}, false, 0.15,'linear');		
		this.p_resolve("close");			
	}

}

online_game={
	
	name : 'online',
	start_time : 0,
	disconnect_time : 0,
	me_conf_play : 0,
	opp_conf_play : 0,
	move_time_left : 0,
	timer_id : 0,
	prv_tick_time:0,
	
	calc_new_rating(old_rating, game_result) {
		
		
		if (game_result === NOSYNC)
			return old_rating;
		
		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (game_result === WIN)
			return Math.round(my_data.rating + 16 * (1 - Ea));
		if (game_result === DRAW)
			return Math.round(my_data.rating + 16 * (0.5 - Ea));
		if (game_result === LOSE)
			return Math.round(my_data.rating + 16 * (0 - Ea));
		
	},
	
	activate() {
		
		//пока еще никто не подтвердил игру
		this.me_conf_play = 0;
		this.opp_conf_play = 0;
		
		//счетчик времени
		this.prv_tick_time=Date.now();
		this.move_time_left = 15;
		this.timer_id = setTimeout(function(){online_game.timer_tick()}, 1000);
		objects.timer_text.tint=0xffffff;
		
		//отображаем таймер
		objects.timer_cont.visible = true;
		
		this.switch_timer();
		
		//фиксируем врему начала игры
		this.start_time = Date.now();
		
		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу он потом изменится
		let lose_rating = this.calc_new_rating(my_data.rating, LOSE);
		if (lose_rating >100 && lose_rating<9999)
			fbs.ref("players/"+my_data.uid+"/rating").set(lose_rating);
		
		//устанавливаем локальный и удаленный статус
		set_state({state : 'p'});		
		
	},
	
	timer_tick() {
		
		this.move_time_left--;
		const cur_time=Date.now();
		if ((cur_time-this.prv_tick_time)>5000||cur_time<this.prv_tick_time){
			game.stop('timer_error');			
			return;
		}			
		this.prv_tick_time=Date.now();
		
		
		if (this.move_time_left < 0 && my_turn === 1)	{
			
			if (this.me_conf_play === 1)
				game.stop('my_timeout');
			else
				game.stop('my_no_sync');
			
			return;
		}

		if (this.move_time_left < -5 && my_turn === 0) {
			
			if (this.opp_conf_play === 1)
				game.stop('opp_timeout');
			else
				game.stop('opp_no_sync');
			
			
			return;
		}

		if (connected === 0 && my_turn === 0) {
			this.disconnect_time ++;
			if (this.disconnect_time > 5) {
				game.stop('my_no_connection');
				return;				
			}
		}		
		
		//подсвечиваем красным если осталость мало времени
		if (this.move_time_left === 5) {
			objects.timer_text.tint=0xff0000;
			sound.play('clock');
		}

		//обновляем текст на экране
		objects.timer_text.text="0:"+this.move_time_left;
		
	},
	
	send_move(aimed_y,aimed_x,bomb_name){		
		
		fbs.ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:'MOVE',tm:Date.now(),data:{aimed_y,aimed_x,bomb_name}})
	},	
	
	switch_timer(on) {
		
		clearTimeout(this.timer_id);
				
		if(!on)	return;
		
		//заново начинаем таймер
		this.prv_tick_time=Date.now();
		this.timer_id = setInterval(function(){online_game.timer_tick()}, 1000);
		
		//обовляем время разъединения
		this.disconnect_time = 0;
		
		//перезапускаем таймер хода
		this.move_time_left = 37;
		objects.timer_text.text="0:"+this.move_time_left;
		objects.timer_text.tint=0xffffff;
		
		if (my_turn){
			objects.timer_cont.x = 90;			
			objects.timer_cont.y = 40;
		}else{
			objects.timer_cont.x = 250;			
			objects.timer_cont.y = -20;
		}

		
	},
		
	async stop(result) {
		
		let res_array = [
			['my_timeout',LOSE, ['Вы проиграли!\nУ вас закончилось время','You lose!\nOut of time!']],
			['opp_timeout',WIN , ['Вы выиграли!\nУ соперника закончилось время','You win!\nOpponent out of time']],
			['my_stop' ,LOSE, ['Вы сдались!','You have given up!']],
			['timer_error' ,NOSYNC, ['Ошибка таймера!','Timer error!']],
			['opp_giveup' ,WIN , ['Вы выиграли!\nСоперник сдался','You win!\nYour opponent has given up!']],
			['my_win',WIN , ['Вы выиграли!\nВсе корабли соперника потоплены!','You win!\nAll enemy ships sunk!']],
			['opp_win',LOSE, ['Вы проиграли!\nВсе Ваши корабли потоплены!','You lose!\nAll your ships are sunk!']],
			['my_no_sync',NOSYNC , ['Похоже вы не захотели начинать игру.','It looks like you did not want to start the game']],
			['opp_no_sync',NOSYNC , ['Похоже соперник не смог начать игру.','It looks like the opponent could not start the game']],
			['my_no_connection',LOSE , ['Потеряна связь!\nИспользуйте надежное интернет соединение.','Lost connection!\nUse a reliable internet connection']]
		];
		
		clearTimeout(this.timer_id);		
		
		let result_row = res_array.find( p => p[0] === result);
		let result_str = result_row[0];
		let result_number = result_row[1];
		let result_info = result_row[2][LANG];				
		let old_rating = my_data.rating;
		my_data.rating = this.calc_new_rating (my_data.rating, result_number);
		fbs.ref('players/'+my_data.uid+'/rating').set(my_data.rating);
		
		//обновляем даные на карточке
		objects.my_card_rating.text=my_data.rating;
		
		//если диалоги еще открыты
		if (objects.stickers_cont.visible===true)
			stickers.hide_panel();	
						
		//убираем элементы
		objects.timer_cont.visible = false;
		
		//отключаем взаимодейтсвие с доской
		//objects.board.pointerdown = function() {};
		
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE || result_number === NOSYNC )
			sound.play('lose');
		else
			sound.play('win');


		//если игра результативна то записываем дополнительные данные
		if (result_number === DRAW || result_number === LOSE || result_number === WIN) {
			
			//увеличиваем количество игр
			my_data.games++;
			fbs.ref('players/'+[my_data.uid]+'/games').set(my_data.games);		

			//записываем результат в базу данных
			let duration = ~~((Date.now() - this.start_time)*0.001);
			fbs.ref('finishes/'+game_id).set({player1:objects.my_card_name.text,player2:objects.opp_card_name.text, res:result_number,fin_type:result_str,duration:duration,rating: [old_rating,my_data.rating],client_id:client_id, ts:firebase.database.ServerValue.TIMESTAMP});
			
		}
		
		
		await big_message.show(result_info, `${['Рейтинг: ','Rating: '][LANG]} ${old_rating} > ${my_data.rating}`,true)
		
	},
	
	clear() {
		
		
	}
	
}

bot_game={

	name :'bot',
	me_conf_play : 0,
	opp_conf_play : 0,
	on:0,

	activate() {

		//устанавливаем локальный и удаленный статус
		set_state ({state : 'b'});
		
		opp_data.uid = 'BOT';
		
		rnd.reset(irnd(100,9999999));
		
		this.on=1;
		
		//anim2.add(objects.opp_field,{y:[450, objects.opp_field.sy]}, true, 0.5,'linear');	
		
		//создаем поле
		//objects.opp_field.set_map(map_creator.run([4,4,3,3,3,2,2,1,1,1]));
		//objects.opp_field.hide_ships();
		
		//таймер уже не нужен
		objects.timer_cont.visible = false;

	},
	
	forced_stop(){
		
		this.on=0;
		
		
	},

	async stop(result) {

		this.on=0;

		let res_array = [
			['my_win',WIN , ['Вы выиграли!\nВсе корабли соперника потоплены!','You win!\nAll enemy ships sunk!']],
			['opp_win',LOSE, ['Вы проиграли!\nВсе Ваши корабли потоплены!','You lose!\nAll your ships are sunk!']],
			['my_stop',DRAW , ['Вы отменили игру.','You canceled the game']]			
		];
		
		let result_number = res_array.find( p => p[0] === result)[1];
		let result_info = res_array.find( p => p[0] === result)[2][LANG];				
					
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE)
			sound.play('lose');
		else
			sound.play('win');		
		
		await big_message.show(result_info, ')))',true)
		
	},
	
	send_move(){			
				
		//флаг сообщающий о получении хода бота		
		game.OPP_MOVE_DATA=null;
		
		//находим свободные цели
		let targets=[];
		for (let y = 0; y <FIELD_Y_CELLS; y++){
			for (let x = 0; x <FIELD_X_CELLS; x++){
				const cell=objects.my_field.map[y][x];
				if (cell.type==='empty'||cell.type==='ship_part' )
					targets.push([y,x,Math.random()]);					
			}
		}		
		targets=targets.sort(function(a, b) {return a[2] - b[2]});
				
		const aimed_y=targets[0][0];
		const aimed_x=targets[0][1];
		const bomb_name='combo_232';
		
		game.OPP_MOVE_DATA={aimed_y, aimed_x, bomb_name};		
		
	},
	
	switch_timer() {
		
		
	},
	
	clear() {
		

		
	}

}

var make_text = function (obj, text, max_width) {

	let sum_v=0;
	let f_size=obj.fontSize;

	for (let i=0;i<text.length;i++) {

		let code_id=text.charCodeAt(i);
		let char_obj=game_res.resources.m2_font.bitmapFont.chars[code_id];
		if (char_obj===undefined) {
			char_obj=game_res.resources.m2_font.bitmapFont.chars[83];
			text = text.substring(0, i) + 'S' + text.substring(i + 1);
		}

		sum_v+=char_obj.xAdvance*f_size/64;
		if (sum_v>max_width) {
			obj.text =  text.substring(0,i-1);
			return;
		}
	}

	obj.text =  text;
}

rnd={
	
	seed:0,
	iter:0,
	
	reset(seed){
		
		this.seed=seed;
		
	},
	
	next(){		
		
		this.seed = this.seed * 16807 % 2147483647;
		return this.seed;
		
	}
	
}

armory={
	
	selected:null,
	on:0,
	
	init(){
		
		this.select_to_0();			
		this.update();	
		
	},
	
	update(){
		
		//сначала скрываем все
		for(let i=0;i<objects.missiles.length;i++)
			objects.missiles[i].visible=false;
		
		let i=0;
		for (let bomb_type of Object.keys(my_data.arms))
			objects.missiles[i++].set(bomb_type);		
		
	},
	
	select_to_0(){		
		objects.missiles.forEach(m=>{m.select(0);m.visible=false});
		this.selected=objects.missiles[0];
		objects.missiles[0].set('combo_0');
		objects.missiles[0].select(1);	
	},
	
	missile_select(m){		
		
		sound.play('click2');
		this.selected=m;	
		objects.missiles.forEach(m=>m.select(0));
		m.select(1);
		
	},	
	
	add_arms(bomb_name, amount){
		
		if (my_data.arms[bomb_name])
			my_data.arms[bomb_name]+=amount;
		else
			my_data.arms[bomb_name]=amount;
		
		this.update();
		
	},
	
	button_down(){
		
		if (!objects.armory_cont.ready)
			return
		
		sound.play('click');
		
		const missiles_num=Object.keys(my_data.arms).length;
						
		if (this.on){
			anim2.add(objects.armory_cont,{y:[objects.armory_cont.y,720]}, true, 0.2,'linear');		
		} else{			
			const tar_y=705-Math.min(6,missiles_num)*80;
			anim2.add(objects.armory_cont,{y:[objects.armory_cont.y,tar_y]}, true, 0.2,'linear');				
		}
				
		this.on=1-this.on;
	}
	
},

game={

	opponent : '',
	selected_checker : 0,
	checker_is_moving : 0,
	aimed_x:0,
	aimed_y:0,
	seed:0,
	on:1,
	OPP_MOVE_DATA:null,	
	MY_MOVE_DATA:null,	
	process_func:function(){},
	selected_missile_conf:{combo:[2,1],num:0},
	
	episodes:[],
	cur_episode:0,
	wait_episode_start_tm:0,
	wait_episode_tm:2000,	
	start_episode:false,
	move_result_info:{missed:0,sinked:0,hited:0},

	activate(opponent, role, my_conf, opp_conf, seed) {

		my_role = role;
		rnd.reset(seed);	
		
		const ships_conf=[4,4,4,4,3,3,3,3,2,2,1,1,1];
		


		
		if (!my_conf) my_conf=map_creator.run(ships_conf);
		if (!opp_conf) opp_conf=map_creator.run(ships_conf);
		
		//маленькие иконки кораблей
		this.prepare_small_icons(my_conf.map(e=>e.length/2));			
				
		//обновляем арсенал
		armory.init();
		


		objects.desktop.texture=gres.desktop.texture;
		anim2.add(objects.desktop,{alpha:[0,1]}, true, 0.5,'linear');
		
		anim2.add(objects.armory_cont,{y:[800,objects.armory_cont.sy]}, true, 0.5,'linear');	
		anim2.add(objects.pref_button_cont,{y:[800,objects.pref_button_cont.sy]}, true, 0.5,'linear');	
		
		this.on=1;
				
		if (this.opponent !== "")
			this.opponent.clear();
		
		//готовим доски с кораблями
		objects.my_field.set_map(my_conf);
		objects.opp_field.set_map(opp_conf);		
		
		//добавили бонусы
		this.add_bonuses(objects.opp_field);
		
		this.opponent = opponent;
		this.opponent.activate();

		//если открыт лидерборд то закрываем его
		if (objects.lb_1_cont.visible===true)
			lb.close();
		
		//если открыт лидерборд то закрываем его
		if (objects.rules_cont.visible)
			objects.rules_cont.visible=false;
		
		//если открыт лидерборд то закрываем его
		if (objects.shop_cont.visible)
			shop.close();
		
		sound.play('note');

		some_process.game_process=this.process.bind(this);
		
		//разные ракеты
		//objects.missiles.forEach(m=>m.set([irnd(1,4),irnd(1,4),irnd(1,4)]));

		//основные элементы игры
		objects.my_card_cont.visible=true;
		objects.opp_card_cont.visible=true;
				
		//включаем взаимодейтсвие с доской
		objects.opp_field.interactive=true;
		objects.opp_field.pointerdown = game.mouse_down_on_field.bind(game);		
				
		objects.opp_field.hide_ships();		
		if (my_role==='master')	
			this.episodes=['P_switch_to_player','P_wait_player_move','P_move','P_wait','P_switch_to_opp','P_wait','P_wait_opp_move','P_move','P_wait']			
		else
			this.episodes=['P_switch_to_opp','P_wait','P_wait_opp_move','P_move','P_wait','P_switch_to_player','P_wait_player_move','P_move','P_wait']			




		this.next_episode(0);
		
	},
	
	add_bonuses(field){
		
		
		
		
		//ракеты
		let bonuses_placed=0;
		while(bonuses_placed===0){			
			const y=irnd(0,10);
			const x=irnd(0,8);			
			const cell=field.map[y][x];
			if (cell.type==='empty'){
				cell.type='bonus'
				cell.bonus_type=['multi_3','multi_5','multi_9'][irnd(0,2)];
				bonuses_placed=1;				
			}			
		}			
		
		if (game_platform==='VK') return;
		
		//денежные бонусы
		bonuses_placed=0;
		while(bonuses_placed<3){			
			const y=irnd(0,10);
			const x=irnd(0,8);			
			const cell=field.map[y][x];
			if (cell.type==='empty'){
				cell.type='bonus'
				cell.bonus_type='money';
				bonuses_placed++;				
			}			
		}			


		
	},
	
	prepare_small_icons(ships_conf){
		
		const ship_part_space=12;
		const row_space=17;
		const ships_space=8;
		
		
		//маленькие иконки
		[...objects.my_mini_icons,...objects.opp_mini_icons].forEach(icon=>{
			icon.visible=false;
			icon.on=1;
			icon.texture=gres.miniship_on_img.texture;
		})
		objects.my_mini_icons.forEach(icon=>icon.visible=false);
		objects.opp_mini_icons.forEach(icon=>icon.visible=false);
		
		let i=0;
		let row=0;
		let xpos=15;
		let ypos=110;
		let prv_ship=ships_conf[0];
		let end_x=0;
		for(let ship of ships_conf){			

			for (let s=0;s<ship;s++){
				const icon=objects.my_mini_icons[i];
				icon.y=ypos;
				icon.x=xpos;
				icon.visible=true;
				icon.ship=ship;
				xpos+=ship_part_space;
				i++;
			}							
			xpos+=ships_space;
			
			if (xpos>150){
				xpos=15;
				row++;
				ypos+=row_space;
			}
		}
			

			
		i=0;
		row=0;
		xpos=235;
		ypos=110;
		prv_ship=ships_conf[0];
		for(let ship of ships_conf){			

			for (let s=0;s<ship;s++){
				const icon=objects.opp_mini_icons[i];
				icon.y=ypos;
				icon.x=xpos;
				icon.visible=true;
				icon.ship=ship;
				xpos-=ship_part_space;
				i++;
			}	
			xpos-=ships_space;			
			if (xpos<100){
				xpos=235;
				row++;
				ypos+=row_space;
			}			
		}
		
	},

	timer_tick() {



	},

	async give_up_down() {
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		
		let res = await confirm_dialog.show(['Сдаетесь?','Giveup?'][LANG]);
		
		if (res === 'yes') {
			
			//отправляем сообщени о сдаче и завершаем игру
			fbs.ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",tm:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

			game.stop('my_giveup');
			
		}
		
		
	},
	
	any_bullet_active(){
		
		for(let i=0;i<objects.bullets.length;i++)
			if (objects.bullets[i].visible)				
				return true;
			
		for(let i=0;i<objects.explosions.length;i++)
			if (objects.explosions[i].visible)				
				return true;
			
		return false;
		
	},
		
	mouse_down_on_field(e) {

		if (anim2.any_on()===true || !this.on) {
			sound.play('locked');
			return
		};

		//координаты указателя
		var mx = e.data.global.x/app.stage.scale.x;
		var my = e.data.global.y/app.stage.scale.y;

		//координаты указателя на игровой доске
		let aimed_y=Math.floor(FIELD_Y_CELLS*(my-objects.opp_field.y-20)/550);		
		let aimed_x=Math.floor(FIELD_X_CELLS*mx/450);
		aimed_y=Math.min(Math.max(aimed_y, 0), FIELD_Y_CELLS-1);		
		aimed_x=Math.min(Math.max(aimed_x, 0), FIELD_X_CELLS-1);
		
		//флаг что я сделал ход
		this.MY_MOVE_DATA=[aimed_y,aimed_x];
			
	},
	
	P_wait(){
		
		if(this.start_episode){		
			console.log('P_wait');	
			this.wait_episode_start_tm=Date.now();
			this.start_episode=false;
			//this.add_info('Ждем...',999);
		}
		
		if (Date.now()>this.wait_episode_start_tm+this.wait_episode_tm)
			this.next_episode();
		
	},
	
	P_switch_to_player(){
		
		if(this.start_episode){		
			this.move_result_info={missed:0,sinked:0,hited:0};
			console.log('P_switch_to_player');	
			anim2.add(objects.my_field,{alpha:[1,0]}, false, 0.25,'linear');	
			anim2.add(objects.opp_field,{alpha:[0,1]}, true, 0.25,'linear');	
			this.start_episode=false;
			this.add_info('Преход хода к игроку...',999);
			objects.opp_card_cont.alpha=0.5;
			objects.my_card_cont.alpha=1;
		}
		
		if (objects.opp_field.ready)
			this.next_episode();
		
	},
	
	P_switch_to_opp(){
		
		if(this.start_episode){	
			this.move_result_info={missed:0,sinked:0,hited:0};
			console.log('P_switch_to_opp');	
			anim2.add(objects.opp_field,{alpha:[1,0]}, false, 0.25,'linear');	
			anim2.add(objects.my_field,{alpha:[0,1]}, true, 0.25,'linear');	
			this.start_episode=false;
			this.add_info('Преход хода к сопернику...',999);
			objects.opp_card_cont.alpha=1;
			objects.my_card_cont.alpha=0.5;
		}
		
		if (objects.my_field.ready)
			this.next_episode();
	},
	
	P_wait_player_move(){
		
		if(this.start_episode){		
			console.log('P_wait_player_move');	
			this.MY_MOVE_DATA=null
			this.start_episode=false;
			this.add_info(['Ваш ход...','Your turn...'][LANG],999);
			
			my_turn=1;
			this.opponent.switch_timer(1);
		}
		
		if (!this.MY_MOVE_DATA) return;
		
		my_turn=0;
		this.opponent.me_conf_play=1;
		this.opponent.switch_timer(0);
		
		const [aimed_y,aimed_x]=this.MY_MOVE_DATA;
		
		//если кликнули на уже отмеченую клетку
		const tar_cell=objects.opp_field.map[aimed_y][aimed_x];
		
		if (['missed','ship_part_hited','ship_destroyed','bonus_opened'].includes(tar_cell.type)){
			sound.play('locked');
			this.MY_MOVE_DATA=null;
			return;
		}		


		const bomb_name=armory.selected.bomb_name;
		
		if (my_data.arms[bomb_name]!=='combo_0'){			
			my_data.arms[bomb_name]--;
			if (my_data.arms[bomb_name]===0){				
				delete my_data.arms[bomb_name];
				armory.select_to_0();
			}
			fbs.ref('players/' + my_data.uid + '/arms').set(my_data.arms);	
			armory.update();
		}

		
		//отправляем ход сопернику		
		if (this.opponent===online_game) this.opponent.send_move(aimed_y,aimed_x,armory.selected.bomb_name);		
					
		this.next_episode();
		this.init_move(objects.opp_field,{aimed_y,aimed_x,bomb_name})		
	},
	
	P_move(){
		
		if(this.start_episode){		
			console.log('P_move');	
			this.start_episode=false;	
			//this.add_info('Атака...',999);
		}
		
		for(let i=0;i<objects.bullets.length;i++)
			objects.bullets[i].process();
		
		if (!anim2.any_on()&&!this.any_bullet_active()){
						
			this.add_info(`${['Мимо','Missed'][LANG]}:${this.move_result_info.missed} ${['Подбито','Hited'][LANG]}:${this.move_result_info.hited} ${['Потоплено','Sinked'][LANG]}:${this.move_result_info.sinked}`,999);
			if (objects.opp_field.all_destroyed()){
				this.stop('my_win');
				return
			}
			if (objects.my_field.all_destroyed()){
				this.stop('opp_win');
				return
			}	
			
			this.next_episode();			
		}

		
	},
	
	P_wait_opp_move(){
		
		if(this.start_episode){		
			console.log('P_wait_opp_move');	
			this.start_episode=false;
			if (this.opponent===bot_game) this.opponent.send_move();
			this.add_info('Ждем соперника...',999);
			
			my_turn=0;
			this.opponent.switch_timer(1);
		}
		
		if (this.OPP_MOVE_DATA){		
			this.opponent.opp_conf_play=1;
			this.opponent.switch_timer(0);
			this.init_move(objects.my_field,this.OPP_MOVE_DATA)
			this.next_episode();
			this.OPP_MOVE_DATA=null;
		}
	},
	
	init_move(field, move_data){
		
		const bomb_name=move_data.bomb_name;
		const [bomb_type,bomb_config]=bomb_name.split('_');
		
		//если выбрана мульти бомба
		if (bomb_type==='multi'){
			
			const targets_data={3:[[0,0],[0,-1],[0,1]],5:[[0,0],[0,-1],[0,1],[-1,0],[1,0]],9:[[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]]}
			const targets=targets_data[bomb_config];
			
			for (let t of targets){
				const ty=t[0]+move_data.aimed_y;
				const tx=t[1]+move_data.aimed_x;
				
				if (ty>=0&&ty<FIELD_Y_CELLS&&tx>=0&&tx<FIELD_X_CELLS)
					this.start_move(field,ty,tx,{combo:[0],num:0});
			}
		}
		
		//если выбрана обычная ракета
		if (bomb_type==='combo'){
			//начальные параметры комбо
			const combo={combo:bomb_config,num:0};			
			this.start_move(field,move_data.aimed_y,move_data.aimed_x,combo);					
		}
		
	},
		
	next_episode(episode_id){
		
		
		this.start_episode=true;
		if(episode_id!==undefined){			
			this.cur_episode=episode_id;
			this.process_func=this[this.episodes[this.cur_episode]];
			return;
		}
		
		this.cur_episode=(this.cur_episode+1)%this.episodes.length;
		this.process_func=this[this.episodes[this.cur_episode]];
		
		
	},
	
	update_mini_icons(field, ship){
				
		const icons=[objects.my_mini_icons,objects.opp_mini_icons][+(field===objects.opp_field)];
		for (let icon of icons){
			if (icon.ship===ship && icon.on){
				icon.texture=gres.miniship_off_img.texture;
				icon.on=0;
				return;
			}
		}		
	
	},
	
	add_info(info, timeout){
		
		anim2.kill_anim(objects.game_info);
		objects.game_info.visible=true;
		objects.game_info.text=info;
		objects.game_info.timeout=Date.now()+timeout;
		
	},
	
	start_move(field, iy,ix,combo_data){
					
		const cell=field.map[iy][ix];
		const cell_type=cell.type;
		if (cell_type==='empty'){
			this.move_result_info.missed++;
			sound.play('splash');
			cell.other_icon.texture=gres.miss_img.texture;
			cell.other_icon.visible=true;
			cell.type='missed';
			anim2.add(cell.other_icon,{scale_xy:[0.2,0.6666],alpha:[0,0.8]}, true, 0.25,'easeOutBack2');		
		}
		
		if (cell_type==='bonus'){
			sound.play('bonus');
			
			if (cell.bonus_type==='money'){
				cell.other_icon.texture=gres.bonus_money_img.texture;				
				shop.add_money_bonus(MONEY_BONUS);
				this.add_info(`Бонус +${MONEY_BONUS}$`,3000);				
			}else{
				cell.other_icon.texture=gres['bonus_'+cell.bonus_type+'_img'].texture;					
				armory.add_arms(cell.bonus_type,1);
				this.add_info(`Бонус - бомбы!`,3000);		
			}
			

			cell.other_icon.visible=true;
			cell.type='bonus_opened';			
			field.bonus_bcg.y=45+iy*CELL_SIZE;
			field.bonus_bcg.x=45+ix*CELL_SIZE;
			anim2.add(field.bonus_bcg,{scale_xy:[0.2,1.5],rotation:[0,2],alpha:[1,0]}, false, 4,'easeOutCubic',false);
			
			anim2.add(cell.other_icon,{scale_xy:[0.2,0.6666],alpha:[0,0.8],rotation:[-0.2,0]}, true, 1,'easeOutBack2',false);	
		}
		
		if (cell_type==='ship_part'){					
						
			sound.play('expl');
			//cell.ship_part.visible=true;
			cell.other_icon.texture=gres.ship_spotted_img.texture;
			cell.other_icon.visible=true;
			cell.type='ship_part_hited';
			const ship_data=field.ships[cell.ship_id];
			const ship_size=ship_data.pos.length/2;
			ship_data.hits++;
			

			//показываем надписи комбо
			if (field===objects.opp_field){
				
				if (combo_data.num===1)
					if (!objects.normal_combo.visible)
						anim2.add(objects.normal_combo,{alpha:[0.5,0],scale_xy:[0.5,1]}, false, 1,'easeOutCubic');	
					
				if (combo_data.num===2)
					if (!objects.big_combo.visible)
						anim2.add(objects.big_combo,{alpha:[0.5,0],scale_xy:[0.5,1]}, false, 1,'easeOutCubic');	
					
				if (combo_data.num===3)
					if (!objects.mega_combo.visible)
						anim2.add(objects.mega_combo,{alpha:[0.5,0],scale_xy:[0.5,1]}, false, 1,'easeOutCubic');					
			}
			
			this.update_mini_icons(field,ship_size);
			
			if (ship_data.hits===ship_size){
				sound.play('sos');
				console.log(`ship ${cell.ship_id} destroyed`);
				field.show_ship(cell.ship_id);	
				this.move_result_info.sinked++;
			}
			
			this.move_result_info.hited++;
			
			this.add_explosion(iy,ix);
			if (combo_data.num<combo_data.combo.length)
				this.resume_combo(field,iy,ix,combo_data);
		}
	
	},
	
	send_bullet(field,syi,sxi,tyi,txi,combo=0){
		
		for(let i=0;i<objects.bullets.length;i++){
			if (objects.bullets[i].visible===false){				
				objects.bullets[i].activate(field,syi,sxi,tyi,txi,combo);
				return;
			}			
		}
		
	},
	
	sound_button_down(on){
					
		if (on)
			sound.on=on
		else
			sound.on=1-sound.on;
		
		objects.pref_sound_button.texture=gres[['pref_sound_button_off','pref_sound_button'][sound.on]].texture;
		
		sound.play('click');
	},
	
	music_button_down(on){
		
		music.switch();
		
	},
	
	add_explosion(syi,sxi){
		
		for (let exp of objects.explosions){
			if (!exp.visible){
			
				exp.y=objects.my_field.y+45+syi*CELL_SIZE;
				exp.x=objects.my_field.x+45+sxi*CELL_SIZE;
				exp.gotoAndPlay (0);
				exp.loop=false;
				exp.visible=true;
				exp.width=exp.height=80;
				exp.animationSpeed=0.5;
				exp.onComplete=function(){exp.visible=false};
				return;
			}			
		}
		
	},
	
	resume_combo(field,iy,ix,combo_data){		
		
		//находим свободные цели
		let targets=[];
		for (let y = 0; y <FIELD_Y_CELLS; y++){
			for (let x = 0; x <FIELD_X_CELLS; x++){
				const cell=field.map[y][x];
				if (cell.type==='empty'||cell.type==='ship_part'||cell.type==='bonus'){
					const rnd_next=rnd.next();
					targets.push([y,x,rnd_next]);						
					console.log(rnd_next);
				}
				
			}
		}		
		targets = targets.sort(function(a, b) {return a[2] - b[2]});
			
		for (let i=0;i<combo_data.combo[combo_data.num];i++){			
			if (!targets[i]) return;
			
			const upd_combo=JSON.parse(JSON.stringify(combo_data));
			upd_combo.num++;
			
			field.map[targets[i][0]][targets[i][1]].type==='target';
			this.send_bullet(field,iy,ix,targets[i][0],targets[i][1],upd_combo);
		}
	
	},
	
	chat(data) {		
		message.add(data, 10000);
	},
	
	fire_down(){		



		
	},
	
	process(){		
	
		if (objects.my_field.visible){			
			//сначала обнуляем всю карту
			for (let y = 0; y <FIELD_Y_CELLS; y++){
				for (let x = 0; x <FIELD_X_CELLS; x++){				
					const cell=objects.my_field.map[y][x];
					if (cell.type==='ship_part_hited')
						cell.alpha=Math.sin(game_tick*5)*0.5+0.5;
				}
			}
			//objects.my_field.tile_bcg.tilePosition.x-=0.12;
			//objects.my_field.tile_bcg.tilePosition.y-=0.2;
		
		}
		
		if (objects.opp_field.visible){			
			for (let y = 0; y <FIELD_Y_CELLS; y++){
				for (let x = 0; x <FIELD_X_CELLS; x++){				
					const cell=objects.opp_field.map[y][x];
					if (cell.type==='ship_part_hited')
						cell.alpha=Math.sin(game_tick*5)*0.5+0.5;
				}
			}
			//objects.opp_field.tile_bcg.tilePosition.x+=0.12;
			//objects.opp_field.tile_bcg.tilePosition.y+=0.2;
		}
		
		if (objects.game_info.visible&&objects.game_info.ready&&Date.now()>objects.game_info.timeout){
			anim2.add(objects.game_info,{alpha:[1,0]}, true, 0.2,'linear');		
		}
		
		this.process_func();


	},
						
	pref_button_down(){
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		if (objects.pref_button_cont.y===720)
			anim2.add(objects.pref_button_cont,{y:[720,440]}, true, 0.15,'linear');	
		if (objects.pref_button_cont.y===440)
			anim2.add(objects.pref_button_cont,{y:[440,720]}, true, 0.15,'linear');	
	},	

	exit_button_down(){
		
		
		//отправляем сообщени о сдаче и завершаем игру		
		if (this.opponent===online_game){
			fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'GIVEUP',tm:Date.now()});
		}
		
		sound.play('click');
		game.stop('my_stop');
		
	},
			
	emoji_button_down(){		
		
		stickers.show_panel();
		anim2.add(objects.pref_button_cont,{y:[objects.pref_button_cont.y,objects.pref_button_cont.sy]}, true, 0.1,'linear');	
		
	},
			
	async stop (result) {
		
		some_process.game_process=function(){};
		
		objects.bullets.forEach(b=>b.visible=false);
				
		objects.armory_cont.visible=false;
		anim2.add(objects.pref_button_cont,{y:[objects.pref_button_cont.y,800]}, false, 0.1,'linear');
		objects.game_info.visible=false;
		this.on=0;
		await this.opponent.stop(result);
				
		objects.opp_card_cont.visible=false;
		objects.my_card_cont.visible=false;
		
		//рекламная пауза
		ad.show();
		await new Promise((resolve, reject) => setTimeout(resolve, 1000));
		
		objects.my_field.visible=false;
		objects.opp_field.visible=false;
		
		//показыаем основное меню
		main_menu.activate();

		//стираем данные оппонента
		opp_data.uid="";
		
		//соперника больше нет
		this.opponent = "";

		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state ({state : 'o'});
	}

}

shop={
	
	data:[{bomb_name:'combo_3',amount:10,price:10},
			{bomb_name:'combo_32',amount:10,price:13},
			{bomb_name:'combo_33',amount:10,price:18},
			{bomb_name:'combo_322',amount:10,price:22},
			{bomb_name:'combo_332',amount:10,price:30}],
	
	async activate(){		
		
		objects.shop_cont.visible=true;
		objects.shop_cards.forEach(card=>card.visible=false);
		let i=0;
		for (let shop_card of objects.shop_cards){
			shop_card.set(this.data[i++]);
			await anim2.add(shop_card,{x:[-200, shop_card.sx]}, true, 0.25,'easeOutBack');

		}		

		objects.shop_money.visible=!(game_platform==='VK')
		objects.shop_money.text=my_data.money+'$';
		
	},
	
	udpdate(){
		
		
		
	},
	
	add_money_bonus(amount){		
		my_data.money+=amount;
		fbs.ref('players/' + my_data.uid + '/money').set(my_data.money);	
	},
	
	buy_down(card){
		
		if (game_platform==='VK'){
			this.buy_vk(card);
			return;
		}
		
		const bomb_name=this.data[card.id].bomb_name;
		const bombs_num=this.data[card.id].amount;
		const price=this.data[card.id].price;
		
		if (price>my_data.money){			
			message.add(['Покупка невозможна','No money'][LANG]);
			return;
		}
		
		sound.play('money');
		my_data.money-=price;
		
		objects.shop_money.text=my_data.money+'$';		
		armory.add_arms(bomb_name, bombs_num);
		card.update();
		
		fbs.ref('players/' + my_data.uid + '/money').set(my_data.money);		
		fbs.ref('players/' + my_data.uid + '/arms').set(my_data.arms);
		
	},
	
	async buy_vk(card){
		
		const bomb_name=this.data[card.id].bomb_name;	
		const bombs_num=this.data[card.id].amount;

		try {
			const data = await vkBridge.send('VKWebAppShowOrderBox', { type: 'item', item: bomb_name});
			if (data.success){
				sound.play('money');
				armory.add_arms(bomb_name, bombs_num);
				card.update();
				fbs.ref('players/' + my_data.uid + '/arms').set(my_data.arms);
			}
		} catch (e) {
			console.log('Ошибка!', e);
		}

		
	},
		
	exit_button_down(){
		
		sound.play('click');
		this.close();
		main_menu.activate();
		
	},
	
	close(){
		
		objects.shop_cont.visible=false;
		
	}
	
}

feedback={
		
	rus_keys : [[50,176,80,215.07,'1'],[90,176,120,215.07,'2'],[130,176,160,215.07,'3'],[170,176,200,215.07,'4'],[210,176,240,215.07,'5'],[250,176,280,215.07,'6'],[290,176,320,215.07,'7'],[330,176,360,215.07,'8'],[370,176,400,215.07,'9'],[410,176,440,215.07,'0'],[491,176,541,215.07,'<'],[70,224.9,100,263.97,'Й'],[110,224.9,140,263.97,'Ц'],[150,224.9,180,263.97,'У'],[190,224.9,220,263.97,'К'],[230,224.9,260,263.97,'Е'],[270,224.9,300,263.97,'Н'],[310,224.9,340,263.97,'Г'],[350,224.9,380,263.97,'Ш'],[390,224.9,420,263.97,'Щ'],[430,224.9,460,263.97,'З'],[470,224.9,500,263.97,'Х'],[510,224.9,540,263.97,'Ъ'],[90,273.7,120,312.77,'Ф'],[130,273.7,160,312.77,'Ы'],[170,273.7,200,312.77,'В'],[210,273.7,240,312.77,'А'],[250,273.7,280,312.77,'П'],[290,273.7,320,312.77,'Р'],[330,273.7,360,312.77,'О'],[370,273.7,400,312.77,'Л'],[410,273.7,440,312.77,'Д'],[450,273.7,480,312.77,'Ж'],[490,273.7,520,312.77,'Э'],[70,322.6,100,361.67,'!'],[110,322.6,140,361.67,'Я'],[150,322.6,180,361.67,'Ч'],[190,322.6,220,361.67,'С'],[230,322.6,260,361.67,'М'],[270,322.6,300,361.67,'И'],[310,322.6,340,361.67,'Т'],[350,322.6,380,361.67,'Ь'],[390,322.6,420,361.67,'Б'],[430,322.6,460,361.67,'Ю'],[511,322.6,541,361.67,')'],[451,176,481,215.07,'?'],[30,371.4,180,410.47,'ЗАКРЫТЬ'],[190,371.4,420,410.47,'_'],[430,371.4,570,410.47,'ОТПРАВИТЬ'],[531,273.7,561,312.77,','],[471,322.6,501,361.67,'('],[30,273.7,80,312.77,'EN']],	
	eng_keys : [[50,176,80,215.07,'1'],[90,176,120,215.07,'2'],[130,176,160,215.07,'3'],[170,176,200,215.07,'4'],[210,176,240,215.07,'5'],[250,176,280,215.07,'6'],[290,176,320,215.07,'7'],[330,176,360,215.07,'8'],[370,176,400,215.07,'9'],[410,176,440,215.07,'0'],[491,176,541,215.07,'<'],[110,224.9,140,263.97,'Q'],[150,224.9,180,263.97,'W'],[190,224.9,220,263.97,'E'],[230,224.9,260,263.97,'R'],[270,224.9,300,263.97,'T'],[310,224.9,340,263.97,'Y'],[350,224.9,380,263.97,'U'],[390,224.9,420,263.97,'I'],[430,224.9,460,263.97,'O'],[470,224.9,500,263.97,'P'],[130,273.7,160,312.77,'A'],[170,273.7,200,312.77,'S'],[210,273.7,240,312.77,'D'],[250,273.7,280,312.77,'F'],[290,273.7,320,312.77,'G'],[330,273.7,360,312.77,'H'],[370,273.7,400,312.77,'J'],[410,273.7,440,312.77,'K'],[450,273.7,480,312.77,'L'],[471,322.6,501,361.67,'('],[70,322.6,100,361.67,'!'],[150,322.6,180,361.67,'Z'],[190,322.6,220,361.67,'X'],[230,322.6,260,361.67,'C'],[270,322.6,300,361.67,'V'],[310,322.6,340,361.67,'B'],[350,322.6,380,361.67,'N'],[390,322.6,420,361.67,'M'],[511,322.6,541,361.67,')'],[451,176,481,215.07,'?'],[30,371.4,180,410.47,'CLOSE'],[190,371.4,420,410.47,'_'],[430,371.4,570,410.47,'SEND'],[531,273.7,561,312.77,','],[30,273.7,80,312.77,'RU']],
	keyboard_layout : [],
	lang : '',
	p_resolve : 0,
	MAX_SYMBOLS : 50,
	uid:0,
	
	show : function(uid,max_symbols) {
		
		if (max_symbols)
			this.MAX_SYMBOLS=max_symbols
		else
			this.MAX_SYMBOLS=50
		
		this.set_keyboard_layout(['RU','EN'][LANG]);
				
		this.uid = uid;
		objects.feedback_msg.text ='';
		objects.feedback_control.text = `0/${this.MAX_SYMBOLS}`
				
		anim2.add(objects.feedback_cont,{y:[-400, objects.feedback_cont.sy]}, true, 0.4,'easeOutBack');	
		return new Promise(function(resolve, reject){					
			feedback.p_resolve = resolve;	  		  
		});
		
	},
	
	set_keyboard_layout(lang) {
		
		this.lang = lang;
		
		if (lang === 'RU') {
			this.keyboard_layout = this.rus_keys;
			objects.feedback_bcg.texture = gres.feedback_bcg_rus.texture;
		} 
		
		if (lang === 'EN') {
			this.keyboard_layout = this.eng_keys;
			objects.feedback_bcg.texture = gres.feedback_bcg_eng.texture;
		}
		
	},
	
	close : function() {
			
		anim2.add(objects.feedback_cont,{y:[objects.feedback_cont.y,450]}, false, 0.4,'easeInBack');		
		
	},
	
	response_message:function(s) {

		
		objects.feedback_msg.text = s.name.text.split(' ')[0]+', ';	
		objects.feedback_control.text = `${objects.feedback_msg.text.length}/${feedback.MAX_SYMBOLS}`		
		
	},
	
	get_texture_for_key (key) {
		
		if (key === '<' || key === 'EN' || key === 'RU') return gres.hl_key1.texture;
		if (key === 'ЗАКРЫТЬ' || key === 'ОТПРАВИТЬ' || key === 'SEND' || key === 'CLOSE') return gres.hl_key2.texture;
		if (key === '_') return gres.hl_key3.texture;
		return gres.hl_key0.texture;
	},
	
	key_down : function(key) {
		
		
		if (objects.feedback_cont.visible === false || objects.feedback_cont.ready === false) return;
		
		key = key.toUpperCase();
		
		if (key === 'ESCAPE') key = {'RU':'ЗАКРЫТЬ','EN':'CLOSE'}[this.lang];			
		if (key === 'ENTER') key = {'RU':'ОТПРАВИТЬ','EN':'SEND'}[this.lang];	
		if (key === 'BACKSPACE') key = '<';
		if (key === ' ') key = '_';
			
		var result = this.keyboard_layout.find(k => {
			return k[4] === key
		})
		
		if (result === undefined) return;
		this.pointerdown(null,result)
		
	},
	
	pointerdown : function(e, inp_key) {
		
		let key = -1;
		let key_x = 0;
		let key_y = 0;		
		
		if (e !== null) {
			
			let mx = e.data.global.x/app.stage.scale.x - objects.feedback_cont.x;
			let my = e.data.global.y/app.stage.scale.y - objects.feedback_cont.y;;

			let margin = 5;
			for (let k of this.keyboard_layout) {			
				if (mx > k[0] - margin && mx <k[2] + margin  && my > k[1] - margin && my < k[3] + margin) {
					key = k[4];
					key_x = k[0];
					key_y = k[1];
					break;
				}
			}			
			
		} else {
			
			key = inp_key[4];
			key_x = inp_key[0];
			key_y = inp_key[1];			
		}
		
		
		
		//не нажата кнопка
		if (key === -1) return;			
				
		//подсвечиваем клавишу
		objects.hl_key.x = key_x - 10;
		objects.hl_key.y = key_y - 10;		
		objects.hl_key.texture = this.get_texture_for_key(key);
		anim2.add(objects.hl_key,{alpha:[1, 0]}, false, 0.5,'linear');
						
		if (key === '<') {
			objects.feedback_msg.text=objects.feedback_msg.text.slice(0, -1);
			key ='';
		}			
		
		
		if (key === 'EN' || key === 'RU') {
			this.set_keyboard_layout(key)
			return;	
		}	
		
		if (key === 'ЗАКРЫТЬ' || key === 'CLOSE') {
			this.close();
			this.p_resolve(['close','']);	
			key ='';
			sound.play('keypress');
			return;	
		}	
		
		if (key === 'ОТПРАВИТЬ' || key === 'SEND') {
			
			if (objects.feedback_msg.text === '') return;
			
			//если нашли ненормативную лексику то закрываем
			let mats =/шлю[хш]|п[еи]д[аеор]|суч?ка|г[ао]ндо|х[ую][ейяе]л?|жоп|соси|дроч|чмо|говн|дерьм|трах|секс|сосат|выеб|пизд|срал|уеб[аико]щ?|ебень?|ебу[ч]|ху[йия]|еба[нл]|дроч|еба[тш]|педик|[ъы]еба|ебну|ебл[аои]|ебись|сра[кч]|манда|еб[лн]я|ублюд|пис[юя]/i;		
			
			let text_no_spaces = objects.feedback_msg.text.replace(/ /g,'');
			if (text_no_spaces.match(mats)) {
				sound.play('locked');
				this.close();
				this.p_resolve(['close','']);	
				key ='';
				return;
			}
			
			this.close();
			this.p_resolve(['sent',objects.feedback_msg.text]);	
			key ='';
			sound.play('keypress');
			return;	
		}	
		
		
		
		if (objects.feedback_msg.text.length >= this.MAX_SYMBOLS)  {
			sound.play('locked');
			return;			
		}
		
		if (key === '_') {
			objects.feedback_msg.text += ' ';	
			key ='';
		}			
		

		sound.play('keypress');
		
		objects.feedback_msg.text += key;	
		objects.feedback_control.text = `${objects.feedback_msg.text.length}/${this.MAX_SYMBOLS}`		
		
	}
	
}

ad={
		
		
	show : function() {
		
		if (game_platform==="YANDEX") {			
			//показываем рекламу
			window.ysdk.adv.showFullscreenAdv({
			  callbacks: {
				onClose: function() {}, 
				onError: function() {}
						}
			})
		}
		
		if (game_platform==="VK") {
					 
			vkBridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"})
			.then(data => console.log(data.result))
			.catch(error => console.log(error));	
		}		

		if (game_platform==="MY_GAMES") {
					 
			my_games_api.showAds({interstitial:true});
		}			
		
		if (game_platform==='GOOGLE_PLAY') {
			if (typeof Android !== 'undefined') {
				Android.showAdFromJs();
			}			
		}
		
		
	},
	
	show2 : async function() {
		
		
		if (game_platform ==="YANDEX") {
			
			let res = await new Promise(function(resolve, reject){				
				window.ysdk.adv.showRewardedVideo({
						callbacks: {
						  onOpen: () => {},
						  onRewarded: () => {resolve('ok')},
						  onClose: () => {resolve('err')}, 
						  onError: (e) => {resolve('err')}
					}
				})
			
			})
			return res;
		}
		
		if (game_platform === "VK") {	

			let data = '';
			try {
				data = await vkBridge.send("VKWebAppShowNativeAds", { ad_format: "reward" })
			}
			catch(error) {
				data ='err';
			}
			
			if (data.result) return 'ok'
			
			
		}	
		
		return 'err';
		
	}
}

vk={
	
	invite_button_down(){
		if (anim2.any_on())
			return;
		
		sound.play('click');
		vkBridge.send('VKWebAppShowInviteBox');
		anim2.add(objects.vk_buttons_cont,{y:[objects.vk_buttons_cont.y,850]}, false, 0.75,'linear');	
		
	},
	
	share_button_down(){
		
		if (anim2.any_on())
			return;
		
		sound.play('click');
		vkBridge.send('VKWebAppShowWallPostBox', { message: 'Я играю в Морской бой и мне нравится!','attachments': 'https://vk.com/app51722661'})
		anim2.add(objects.vk_buttons_cont,{y:[objects.vk_buttons_cont.y,850]}, false, 0.75,'linear');	
		
	}
	
	
}

confirm_dialog={
	
	p_resolve : 0,
		
	show: function(msg) {
								
		if (objects.confirm_cont.visible === true) {
			sound.play('locked')
			return;			
		}		
		
		sound.play("confirm_dialog");
				
		objects.confirm_msg.text=msg;
		
		anim2.add(objects.confirm_cont,{y:[450,objects.confirm_cont.sy]}, true, 0.6,'easeOutBack');		
				
		return new Promise(function(resolve, reject){					
			confirm_dialog.p_resolve = resolve;	  		  
		});
	},
	
	button_down : function(res) {
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};	
		
		sound.play('click')

		this.close();
		this.p_resolve(res);	
		
	},
	
	close : function() {
		
		anim2.add(objects.confirm_cont,{y:[objects.confirm_cont.sy,450]}, false, 0.4,'easeInBack');		
		
	}

}

keep_alive=function(){
	
	if (h_state === 1) {		
		
		//убираем из списка если прошло время с момента перехода в скрытое состояние		
		let cur_ts = Date.now();	
		let sec_passed = (cur_ts - hidden_state_start)/1000;		
		if ( sec_passed > 100 )	fbs.ref(room_name+"/"+my_data.uid).remove();
		return;		
	}


	fbs.ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	fbs.ref("inbox/"+my_data.uid).onDisconnect().remove();
	fbs.ref(room_name+"/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

var kill_game=function(){
	
	firebase.app().delete();
	document.body.innerHTML = 'CLIENT TURN OFF';
}

var process_new_message = function(msg) {

	//проверяем плохие сообщения
	if (msg===null || msg===undefined)
		return;

	//принимаем только положительный ответ от соответствующего соперника и начинаем игру
	if (msg.message==="ACCEPT"  && pending_player===msg.sender && state !== "p") {
		//в данном случае я мастер и хожу вторым
		lobby.accepted_invite(msg);
	}

	//принимаем также отрицательный ответ от соответствующего соперника
	if (msg.message==="REJECT"  && pending_player === msg.sender) {
		lobby.rejected_invite();
	}

	//айди клиента для удаления дубликатов
	if (msg.message==="CLIEND_ID") 
		if (msg.client_id !== client_id)
			kill_game();


	//получение сообщение в состояни игры
	if (state==='p') {

		//учитываем только сообщения от соперника
		if (msg.sender===opp_data.uid) {

			//получение отказа от игры
			if (msg.message==='REFUSE')
				confirm_dialog.opponent_confirm_play(0);

			//получение согласия на игру
			if (msg.message==='CONF')
				confirm_dialog.opponent_confirm_play(1);

			//получение стикера
			if (msg.message==='MSG')
				stickers.receive(msg.data);

			//получение сообщение с сдаче
			if (msg.message==='GIVEUP' )
				game.stop('opp_giveup');

			//получение сообщение с ходом игорка
			if (msg.message==='MOVE')
				game.OPP_MOVE_DATA=msg.data;
			
			//получение сообщение с ходом игорка
			if (msg.message==='CHAT')
				game.chat(msg.data);
			
		}
	}

	//приглашение поиграть
	if(state==="o" || state==="b") {
		if (msg.message==="INV") {
			req_dialog.show(msg.sender);
		}
		if (msg.message==="INV_REM") {
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.sender === req_dialog._opp_data.uid)
				req_dialog.hide(msg.sender);
		}
	}

}

req_dialog={

	_opp_data : {} ,
	
	async show(uid) {
		
		//если нет в кэше то загружаем из фб
		await lobby.update_players_cache_data(uid);
		
		sound.play('receive_sticker');			
		anim2.add(objects.req_cont,{scale_y:[0, 1]}, true, 0.15,'linear');
							
		//Отображаем  имя и фамилию в окне приглашения
		req_dialog._opp_data.name=lobby.players_cache[uid].name;
		make_text(objects.req_name,lobby.players_cache[uid].name,200);
		objects.req_rating.text=lobby.players_cache[uid].rating;
		req_dialog._opp_data.rating=lobby.players_cache[uid].rating;

		//throw "cut_string erroor";
		req_dialog._opp_data.uid=uid;
		objects.req_avatar.texture=await lobby.get_texture(lobby.players_cache[uid].pic_url);


	},

	reject: function() {

		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;
		
		sound.play('close');

		anim2.add(objects.req_cont,{scale_y:[1, 0]}, false, 0.15,'linear');

		fbs.ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},

	accept: function() {

		if (anim2.any_on()||objects.req_cont.visible===false || objects.big_message_cont.visible === true || game.state === 'pending') {
			sound.play('locked');
			return;			
		}

		
		//устанавливаем окончательные данные оппонента
		opp_data = req_dialog._opp_data;	
	
		anim2.add(objects.req_cont,{scale_y:[1, 0]}, false, 0.15,'linear');


		//отправляем информацию о согласии играть с идентификатором игры
		game_id=~~(Math.random()*99999);
		const my_conf=map_creator.run([4,4,3,3,3,2,2,1,1,1]);
		const opp_conf=map_creator.run([4,4,3,3,3,2,2,1,1,1]);
		const seed=irnd(100,999999);
		fbs.ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT",tm:Date.now(),my_conf,opp_conf,seed});

		//заполняем карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,150);
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_avatar.texture=objects.req_avatar.texture;

		main_menu.close();
		lobby.close();
		game.activate(online_game, 'slave',my_conf,opp_conf,seed);

	},

	hide: function() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready === false || objects.req_cont.visible === false)
			return;

		anim2.add(objects.req_cont,{scale_y:[1, 0]}, false, 0.15,'linear');

	}

}

rules={
	
	activate(){
		
		objects.rules_cont.visible=true;
		
	},
	
	exit_down(){
		
		if (anim2.any_on()) return;
		sound.play('click');
		objects.rules_cont.visible=false;
		main_menu.activate();	
		
	},	
	
	swipe_down(dir){
		
		if (anim2.any_on()) return;
		
		
		if (dir===1){
			
			if (objects.rules_page_2.x===0)
				return;
			
			
			anim2.add(objects.rules_page_1,{x:[0, -450]}, false, 0.25,'linear');
			anim2.add(objects.rules_page_2,{x:[450, 0]}, true, 0.25,'linear');		
		}
		
		if (dir===-1){
			
			if (objects.rules_page_1.x===0)
				return;
			
			anim2.add(objects.rules_page_1,{x:[-450, 0]}, true, 0.25,'linear');
			anim2.add(objects.rules_page_2,{x:[0, 450]}, false, 0.25,'linear');		
		}
		
		sound.play('click');
		
	}
	
}

main_menu={

	async activate() {
				
		
		//проверяем и включаем музыку
		music.activate();
				
		//игровой титл
		anim2.add(objects.game_title,{y:[-100,objects.game_title.sy],alpha:[0,1]}, true, 0.75,'linear');	
		
		objects.desktop.texture=gres.desktop.texture;
		anim2.add(objects.desktop,{alpha:[0,1]}, true, 0.5,'linear');	
		
		some_process.main_menu=this.process;
		
		//vk
		if (game_platform==='VK')
		anim2.add(objects.vk_buttons_cont,{y:[850,objects.vk_buttons_cont.sy]}, true, 0.75,'linear');	

		//кнопки
		await anim2.add(objects.main_buttons_cont,{y:[450,objects.main_buttons_cont.sy],alpha:[0,1]}, true, 0.75,'linear');	

	},

	async close() {
		
		//игровой титл
		anim2.add(objects.game_title,{y:[objects.game_title.y,-100],alpha:[1,0]}, false, 0.5,'linear');	
		
		//anim2.add(objects.desktop,{alpha:[1,0]}, false, 0.5,'linear');	
		//some_process.main_menu=function(){};
		
		//кнопки
		await anim2.add(objects.main_buttons_cont,{y:[objects.main_buttons_cont.y, 450],alpha:[1,0]}, false, 0.5,'linear');	
		
		//vk
		if(objects.vk_buttons_cont.visible)
			anim2.add(objects.vk_buttons_cont,{y:[objects.vk_buttons_cont.y,850]}, false, 0.75,'linear');	

	},

	async play_online_down() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		sound.play('click');

		await this.close();
		lobby.activate();

	},
	
	async play_bot_down() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		sound.play('click');
		
		await this.close();
		
		//заполняем данные бот-оппонента
		objects.opp_card_name.text='BOT';
		objects.opp_card_rating.text='1400';
		objects.opp_avatar.texture=gres.pc_icon.texture;	
		
		game.activate(bot_game, 'master');

	},

	async lb_button_down () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		lb.show();

	},

	rules_button_down () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');
		
		this.close();
		rules.activate();


	},

	shop_button_down() {

		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
			
		sound.play('click');
			
		this.close();
		shop.activate();

	},

	pref_ok_down() {

		sound.play('close');
		anim2.add(objects.pref_cont,{y:[objects.pref_cont.sy, -200]}, false, 0.5,'easeInBack');

	},

	chk_type_sel(i) {

		if (i===0)
		{
			objects.chk_opt_frame.x=60;
			objects.chk_opt_frame.y=70;
			board_func.chk_type = 'quad';

		}

		if (i===1)
		{
			objects.chk_opt_frame.x=160;
			objects.chk_opt_frame.y=70;
			board_func.chk_type = 'star';

		}

		if (i===2)
		{
			objects.chk_opt_frame.x=260;
			objects.chk_opt_frame.y=70;
			board_func.chk_type = 'round';
		}
	},

	pref_sound_switched() {
		
		if (objects.pref_sound_switch.ready === false) {
			sound.play('locked');
			return;
		}
		
		if (sound.on === 1) {
			anim2.add(objects.pref_sound_switch,{x:[127, 91]}, true, 0.25,'linear');		
			sound.on = 0;
			return;
		}

		if (sound.on === 0){
			
			anim2.add(objects.pref_sound_switch,{x:[91, 127]}, true, 0.25,'linear');		
			sound.on = 1;	
			sound.play('close');			
			return;			
		}
		
	},
	
	process(){
		
		for (let bubble of objects.bubbles){
			
			bubble.y-=bubble.speed;
			
			if (bubble.y<-bubble.height){

				const scale_xy=Math.random()*0.5+0.1;
				bubble.scale_xy=scale_xy;
				bubble.speed=1-scale_xy;
				bubble.x=irnd(0,M_WIDTH);
				bubble.y=M_HEIGHT+bubble.height;				
			}
			
			
		}
		
	}

}

lb={

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],
	last_update:0,

	show: function() {

		objects.desktop.texture=game_res.resources.lb_bcg.texture;
		anim2.add(objects.desktop,{alpha:[0,1]}, true, 0.5,'linear');	
		

		anim2.add(objects.lb_1_cont,{x:[-150, objects.lb_1_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_2_cont,{x:[-150, objects.lb_2_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_3_cont,{x:[-150, objects.lb_3_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_cards_cont,{x:[450, 0]}, true, 0.5,'easeOutCubic');
				
		objects.lb_cards_cont.visible=true;
		objects.lb_back_button.visible=true;

		for (let i=0;i<7;i++) {
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];
			objects.lb_cards[i].place.text=(i+4)+".";

		}

		if (Date.now()-this.last_update>120000){
			this.update();			
			this.last_update=Date.now();			
		}


	},

	close: function() {


		objects.lb_1_cont.visible=false;
		objects.lb_2_cont.visible=false;
		objects.lb_3_cont.visible=false;
		objects.lb_cards_cont.visible=false;
		objects.lb_back_button.visible=false;

	},

	back_button_down: function() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};


		sound.play('click');
		this.close();
		main_menu.activate();

	},

	update: function () {

		fbs.ref("players").orderByChild('rating').limitToLast(20).once('value').then((snapshot) => {


			raw_leaders_data = snapshot.val();
			if (raw_leaders_data===null) {
			  //console.log("Что-то не получилось получить данные о рейтингах");
			}
			else {

				var leaders = [];
				Object.keys(raw_leaders_data).forEach(uid => {
					
					if (raw_leaders_data[uid].name!=="" && raw_leaders_data[uid].name!=='')
						leaders.push([raw_leaders_data[uid].name, raw_leaders_data[uid].rating, raw_leaders_data[uid].pic_url, uid]);
				});


				leaders.sort(function(a, b) {	return b[1] - a[1];});

				//создаем загрузчик топа
				var loader = new PIXI.Loader();

				var len=Math.min(10,leaders.length);

				//загружаем тройку лучших
				for (let i=0;i<3;i++) {
					make_text(objects['lb_'+(i+1)+'_name'], leaders[i][0],180);					
					objects['lb_'+(i+1)+'_rating'].text = leaders[i][1];
					loader.add('leaders_avatar_'+i, leaders[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
					
					objects['lb_'+(i+1)+'_cont'].interactive = true;
					objects['lb_'+(i+1)+'_cont'].pointerdown = function(){lobby.show_invite_dialog_from_lb(leaders[i][0],leaders[i][1],leaders[i][3])};
				};

				//загружаем остальных
				for (let i=3;i<10;i++) {
					let fname=leaders[i][0];

					make_text(objects.lb_cards[i-3].name,fname,180);

					objects.lb_cards[i-3].rating.text=leaders[i][1];
					objects.lb_cards[i-3].interactive = true;
					objects.lb_cards[i-3].pointerdown = function(){lobby.show_invite_dialog_from_lb(leaders[i][0],leaders[i][1],leaders[i][3])};
					loader.add('leaders_avatar_'+i, leaders[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
				};

				loader.load();

				//показываем аватар как только он загрузился
				loader.onProgress.add((loader, resource) => {
					let lb_num=Number(resource.name.slice(-1));
					if (lb_num<3)
						objects['lb_'+(lb_num+1)+'_avatar'].texture=resource.texture
					else
						objects.lb_cards[lb_num-3].avatar.texture=resource.texture;
				});

			}

		});

	}

}

lobby={
	
	state_tint :{},
	_opp_data : {},
	players_cache : {},
	activated:false,
	rejected_invites:{},
	fb_cache:{},
	sw_header:{time:0,index:0,header_list:[]},
	
	activate() {
		
		//первый запуск лобби
		if (!this.activated){			
			//расставляем по соответствующим координатам
			
			
			
			for(let i=0;i<objects.mini_cards.length;i++) {

				let iy=~~((i)/3)				
				const ix=i%3;	
				

				let shift_x=0;
				if (iy>2){					
					iy-=3
					shift_x+=450;
				}



				
				objects.mini_cards[i].y=60+iy*180;				
				objects.mini_cards[i].x=shift_x+10+ix*140;
					

			}		

			
			//создаем заголовки
			const room_desc=['КОМНАТА #','ROOM #'][LANG]+{'states':1,'states2':2,'states3':3,'states4':4,'states5':5}[room_name];
			this.sw_header.header_list=[['ДОБРО ПОЖАЛОВАТЬ В КАЮТ-КОМПАНИЮ!','WELCOME TO THE WARDROOM!'][LANG],room_desc]
			objects.lobby_header.text=this.sw_header.header_list[0];
			this.sw_header.time=Date.now()+12000;
			this.activated=true;
		}
		
		objects.desktop.texture=gres.lobby_bcg.texture;
		anim2.add(objects.lobby_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		
		objects.cards_cont.x=0;
		
		//отключаем все карточки
		this.card_i=0;
		for(let i=0;i<objects.mini_cards.length;i++)
			objects.mini_cards[i].visible=false;
		
		//процессинг
		some_process.lobby=function(){lobby.process()};
		
		//подписываемся на изменения состояний пользователей
		fbs.ref(room_name) .on('value', (snapshot) => {lobby.players_list_updated(snapshot.val());});

	},

	players_list_updated(players) {

		//если мы в игре то не обновляем карточки
		if (state==="p" || state==="b")
			return;

		//это столы
		let tables = {};
		
		//это свободные игроки
		let single = {};

		//делаем дополнительный объект с игроками и расширяем id соперника
		let p_data = JSON.parse(JSON.stringify(players));
		
		//создаем массив свободных игроков
		for (let uid in players){	

			//обновляем кэш
			if (!this.players_cache[uid]) this.players_cache[uid]={};
			this.players_cache[uid].name=players[uid].name;	
			this.players_cache[uid].rating=players[uid].rating;	
			
			if (players[uid].state !== 'p' && players[uid].hidden === 0)
				single[uid] = players[uid].name;						
		}
		
		//console.table(single);
		
		//убираем не играющие состояние
		for (let uid in p_data)
			if (p_data[uid].state !== 'p')
				delete p_data[uid];		
		
		//дополняем полными ид оппонента
		for (let uid in p_data) {			
			let small_opp_id = p_data[uid].opp_id;			
			//проходимся по соперникам
			for (let uid2 in players) {	
				let s_id=uid2.substring(0,10);				
				if (small_opp_id === s_id) {
					//дополняем полным id
					p_data[uid].opp_id = uid2;
				}							
			}			
		}
				
		
		//определяем столы
		//console.log (`--------------------------------------------------`)
		for (let uid in p_data) {
			let opp_id = p_data[uid].opp_id;
			let name1 = p_data[uid].name;
			let rating = p_data[uid].rating;
			let hid = p_data[uid].hidden;
			
			if (p_data[opp_id] !== undefined) {
				
				if (uid === p_data[opp_id].opp_id && tables[uid] === undefined) {
					
					tables[uid] = opp_id;					
					//console.log(`${name1} (Hid:${hid}) (${rating}) vs ${p_data[opp_id].name} (Hid:${p_data[opp_id].hidden}) (${p_data[opp_id].rating}) `)	
					delete p_data[opp_id];				
				}
				
			} else 
			{				
				//console.log(`${name1} (${rating}) - одиночка `)					
			}			
		}
					
		
		
		//считаем и показываем количество онлайн игрокова
		let num = 0;
		for (let uid in players)
			if (players[uid].hidden===0)
				num++
					
		//считаем сколько одиночных игроков и сколько столов
		let num_of_single = Object.keys(single).length;
		let num_of_tables = Object.keys(tables).length;
		let num_of_cards = num_of_single + num_of_tables;
		
		//если карточек слишком много то убираем столы
		if (num_of_cards > objects.mini_cards.length) {
			let num_of_tables_cut = num_of_tables - (num_of_cards - objects.mini_cards.length);			
			
			let num_of_tables_to_cut = num_of_tables - num_of_tables_cut;
			
			//удаляем столы которые не помещаются
			let t_keys = Object.keys(tables);
			for (let i = 0 ; i < num_of_tables_to_cut ; i++) {
				delete tables[t_keys[i]];
			}
		}

		
		//убираем карточки пропавших игроков и обновляем карточки оставшихся
		for(let i=0;i<objects.mini_cards.length;i++) {			
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {				
				let card_uid = objects.mini_cards[i].uid;				
				if (single[card_uid] === undefined)					
					objects.mini_cards[i].visible = false;
				else
					this.update_existing_card({id:i, state:players[card_uid].state , rating:players[card_uid].rating});
			}
		}
		
		//определяем новых игроков которых нужно добавить
		new_single = {};		
		
		for (let p in single) {
			
			let found = 0;
			for(let i=0;i<objects.mini_cards.length;i++) {			
			
				if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {					
					if (p ===  objects.mini_cards[i].uid) {
						
						found = 1;							
					}	
				}				
			}		
			
			if (found === 0)
				new_single[p] = single[p];
		}
		
		
		//убираем исчезнувшие столы (если их нет в новом перечне) и оставляем новые
		for(let i=0;i<objects.mini_cards.length;i++) {			
		
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'table') {
				
				let uid1 = objects.mini_cards[i].uid1;	
				let uid2 = objects.mini_cards[i].uid2;	
				
				let found = 0;
				
				for (let t in tables) {
					
					let t_uid1 = t;
					let t_uid2 = tables[t];				
					
					if (uid1 === t_uid1 && uid2 === t_uid2) {
						delete tables[t];
						found = 1;						
					}							
				}
								
				if (found === 0)
					objects.mini_cards[i].visible = false;
			}	
		}
		
		
		//размещаем на свободных ячейках новых игроков
		for (let uid in new_single)			
			this.place_new_card({uid:uid, state:players[uid].state, name : players[uid].name,  rating : players[uid].rating});

		//размещаем новые столы сколько свободно
		for (let uid in tables) {			
			let n1=players[uid].name
			let n2=players[tables[uid]].name
			
			let r1= players[uid].rating
			let r2= players[tables[uid]].rating
			
			const game_id=players[uid].game_id;
			this.place_table({uid1:uid,uid2:tables[uid],name1: n1, name2: n2, rating1: r1, rating2: r2,game_id});
		}
		
	},

	get_state_texture(s) {
	
		switch(s) {

			case "o":
				return gres.mini_player_card_online.texture;
			break;

			case "b":
				return gres.mini_player_card_bot.texture;
			break;

			case "p":
				return gres.mini_player_card.texture;
			break;
			
			case "bot":
				return gres.mini_player_card.texture;
			break;

		}
	},
	
	place_table(params={uid1:0,uid2:0,name1: "XXX",name2: "XXX", rating1: 1400, rating2: 1400,game_id:0}) {
				
		for(let i=1;i<objects.mini_cards.length;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.texture=this.get_state_texture(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "table";
				
				
				objects.mini_cards[i].bcg.texture = gres.mini_player_card_table.texture;
				
				//присваиваем карточке данные
				//objects.mini_cards[i].uid=params.uid;
				objects.mini_cards[i].uid1=params.uid1;
				objects.mini_cards[i].uid2=params.uid2;
												
				//убираем элементы свободного стола
				objects.mini_cards[i].t_rating.visible = false;
				objects.mini_cards[i].avatar.visible = false;
				objects.mini_cards[i].avatar_frame.visible = false;
				objects.mini_cards[i].t_name.visible = false;

				//Включаем элементы стола 
				objects.mini_cards[i].table_frame.visible=true;
				objects.mini_cards[i].t_rating1.visible = true;
				objects.mini_cards[i].t_rating2.visible = true;
				objects.mini_cards[i].avatar1.visible = true;
				objects.mini_cards[i].avatar2.visible = true;
				//objects.mini_cards[i].rating_bcg.visible = true;

				objects.mini_cards[i].t_rating1.text = params.rating1;
				objects.mini_cards[i].t_rating2.text = params.rating2;
				
				objects.mini_cards[i].name1 = params.name1;
				objects.mini_cards[i].name2 = params.name2;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid1, tar_obj:objects.mini_cards[i].avatar1});
				
				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid2, tar_obj:objects.mini_cards[i].avatar2});


				objects.mini_cards[i].visible=true;
				objects.mini_cards[i].game_id=params.game_id;

				break;
			}
		}
		
	},

	update_existing_card(params={id:0, state:"o" , rating:1400}) {

		//устанавливаем цвет карточки в зависимости от состояния(имя и аватар не поменялись)
		objects.mini_cards[params.id].bcg.texture=this.get_state_texture(params.state);
		objects.mini_cards[params.id].state=params.state;

		objects.mini_cards[params.id].rating=params.rating;
		objects.mini_cards[params.id].t_rating.text=params.rating;
		objects.mini_cards[params.id].visible=true;
	},

	place_new_card(params={uid:0, state: "o", name: "XXX", rating: rating}) {

		for(let i=0;i<objects.mini_cards.length;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.texture=this.get_state_texture(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "single";


				//присваиваем карточке данные
				objects.mini_cards[i].uid=params.uid;

				//убираем элементы стола так как они не нужны
				objects.mini_cards[i].t_rating1.visible = false;
				objects.mini_cards[i].t_rating2.visible = false;
				objects.mini_cards[i].avatar1.visible = false;
				objects.mini_cards[i].avatar2.visible = false;
				objects.mini_cards[i].table_frame.visible=false;
				
				//включаем элементы свободного стола
				objects.mini_cards[i].t_rating.visible = true;
				objects.mini_cards[i].avatar.visible = true;
				objects.mini_cards[i].avatar_frame.visible = true;
				objects.mini_cards[i].t_name.visible = true;

				objects.mini_cards[i].name=params.name;
				make_text(objects.mini_cards[i].t_name,params.name,105);
				objects.mini_cards[i].rating=params.rating;
				objects.mini_cards[i].t_rating.text=params.rating;

				objects.mini_cards[i].visible=true;

				//стираем старые данные
				objects.mini_cards[i].avatar.texture=PIXI.Texture.EMPTY;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid, tar_obj:objects.mini_cards[i].avatar});

				//console.log(`новая карточка ${i} ${params.uid}`)
				return;
			}
		}

	},

	async get_texture(pic_url) {
		
		if (!pic_url) PIXI.Texture.WHITE;
		
		//меняем адрес который невозможно загрузить
		if (pic_url==="https://vk.com/images/camera_100.png")
			pic_url = "https://i.ibb.co/fpZ8tg2/vk.jpg";	
				
		if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {
					
			let loader=new PIXI.Loader();
			loader.add('pic', pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});			
			await new Promise((resolve, reject)=> loader.load(resolve))	
			return loader.resources.pic.texture||PIXI.Texture.WHITE;

		}		
		
		return PIXI.utils.TextureCache[pic_url];		
	},
	
	async update_players_cache_data(uid){
		if (this.players_cache[uid]){
			if (!this.players_cache[uid].name){
				let t=await fbs.ref('players/' + uid + '/name').once('value');
				this.players_cache[uid].name=t.val()||'***';
			}
			
			if (!this.players_cache[uid].rating){
				let t=await fbs.ref('players/' + uid + '/rating').once('value');
				this.players_cache[uid].rating=t.val()||'***';
			}
				
			if (!this.players_cache[uid].pic_url){
				let t=await fbs.ref('players/' + uid + '/pic_url').once('value');
				this.players_cache[uid].pic_url=t.val()||null;
			}
			
		}else{
			
			this.players_cache[uid]={};
			let t=await fbs.ref('players/' + uid).once('value');
			t=t.val();
			this.players_cache[uid].name=t.name||'***';
			this.players_cache[uid].rating=t.rating||'***';
			this.players_cache[uid].pic_url=t.pic_url||'';
		}		
	},
		
	async load_avatar2 (params = {uid : 0, tar_obj : 0, card_id : 0}) {		

		await this.update_players_cache_data(params.uid);
		const pic_url=this.players_cache[params.uid].pic_url;
		const t=await this.get_texture(pic_url);
		params.tar_obj.texture=t;			
	},

	add_card_ai() {

		//убираем элементы стола так как они не нужны
		objects.mini_cards[0].t_rating1.visible = false;
		objects.mini_cards[0].t_rating2.visible = false;
		objects.mini_cards[0].avatar1.visible = false;
		objects.mini_cards[0].avatar2.visible = false;
		objects.mini_cards[0].table_rating_hl.visible = false;
		objects.mini_cards[0].bcg.texture=gres.mini_player_card_ai.texture;

		objects.mini_cards[0].visible=true;
		objects.mini_cards[0].uid="BOT";
		objects.mini_cards[0].name=objects.mini_cards[0].t_name.text=['Бот','Bot'][LANG];

		objects.mini_cards[0].rating=1400;		
		objects.mini_cards[0].t_rating.text = objects.mini_cards[0].rating;
		objects.mini_cards[0].avatar.texture=game_res.resources.pc_icon.texture;
	},
	
	card_down(card_id) {
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dialog(card_id);
		
		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id);
				
	},
	
	show_table_dialog(card_id) {
					
		return;
		//если какая-то анимация или открыт диалог
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		//закрываем диалог стола если он открыт
		if(objects.invite_cont.visible) this.close_invite_dialog();
		
		anim2.add(objects.td_cont,{x:[800, objects.td_cont.sx]}, true, 0.1,'linear');
		
		objects.td_cont.card=objects.mini_cards[card_id];
		
		objects.td_avatar1.texture = objects.mini_cards[card_id].avatar1.texture;
		objects.td_avatar2.texture = objects.mini_cards[card_id].avatar2.texture;
		
		objects.td_rating1.text = objects.mini_cards[card_id].t_rating1.text;
		objects.td_rating2.text = objects.mini_cards[card_id].t_rating2.text;
		
		make_text(objects.td_name1, objects.mini_cards[card_id].name1, 240);
		make_text(objects.td_name2, objects.mini_cards[card_id].name2, 240);
		
	},
	
	close_table_dialog() {
		sound.play('close');
		anim2.add(objects.td_cont,{x:[objects.td_cont.x, 800]}, false, 0.1,'linear');
	},

	show_invite_dialog(card_id) {

		//если какая-то анимация или уже сделали запрос
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};		
				
		//закрываем диалог стола если он открыт
		//if(objects.td_cont.visible) this.close_table_dialog();

		pending_player="";

		sound.play('click');			
		
		//objects.invite_feedback.text = '';

		//показыаем кнопку приглашения
		objects.invite_button.texture=game_res.resources.invite_button.texture;
	
		anim2.add(objects.invite_cont,{scale_y:[0, 1]}, true, 0.1,'linear');
		
		//копируем предварительные данные
		lobby._opp_data = {uid:objects.mini_cards[card_id].uid,name:objects.mini_cards[card_id].name,rating:objects.mini_cards[card_id].rating};
			
		
		//this.show_feedbacks(lobby._opp_data.uid);
		
		objects.invite_button_title.text=['Пригласить','Send invite'][LANG];

		let invite_available = 	lobby._opp_data.uid !== my_data.uid;
		invite_available=invite_available && (objects.mini_cards[card_id].state==="o" || objects.mini_cards[card_id].state==="b");
		invite_available=invite_available || lobby._opp_data.uid==="BOT";
		invite_available=invite_available && lobby._opp_data.rating >= 50 && my_data.rating >= 50;
		
		//кнопка удаления комментариев
		//objects.fb_delete_button.visible=my_data.uid===lobby._opp_data.uid;
		
		//если мы в списке игроков которые нас недавно отврегли
		if (this.rejected_invites[lobby._opp_data.uid] && Date.now()-this.rejected_invites[lobby._opp_data.uid]<60000) invite_available=false;

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=objects.invite_button_title.visible=invite_available;

		//заполняем карточу приглашения данными
		objects.invite_avatar.texture=objects.mini_cards[card_id].avatar.texture;
		make_text(objects.invite_name,lobby._opp_data.name,230);
		objects.invite_rating.text=objects.mini_cards[card_id].t_rating.text;
	},
	
	fb_delete_down(){
		
		objects.fb_delete_button.visible=false;
		fbs.ref('fb/' + my_data.uid).remove();
		this.fb_cache[my_data.uid].fb_obj={0:[['***нет отзывов***','***no feedback***'][LANG],999,' ']};
		this.fb_cache[my_data.uid].tm=Date.now();
		objects.feedback_records.forEach(fb=>fb.visible=false);
		
		message.add(['Отзывы удалены','Feedbacks are removed'][LANG])
		
	},
	
	async close() {

		if (objects.invite_cont.visible === true)
			this.close_invite_dialog();
		
		//if (objects.td_cont.visible === true)
		//	this.close_table_dialog();
		
		some_process.lobby=function(){};

		//плавно все убираем
		anim2.add(objects.lobby_cont,{alpha:[1, 0]}, false, 0.1,'linear');

		//больше ни ждем ответ ни от кого
		pending_player="";
		
		//отписываемся от изменений состояний пользователей
		fbs.ref(room_name).off();

	},
	
	inst_message(data){
		
		//когда ничего не видно не принимаем сообщения
		if(!objects.lobby_cont.visible) return;
		
		sound.play('inst_msg');
		anim2.add(objects.inst_msg_cont,{alpha:[0, 1]},true,0.4,'linear',false);		
		const t=PIXI.utils.TextureCache[this.players_cache?.[data.uid]?.pic_url];
		objects.inst_msg_avatar.texture=t||PIXI.Texture.WHITE;
		make_text(objects.inst_msg_text,data.msg,300);
		objects.inst_msg_cont.tm=Date.now();
	},
	
	process(){
		
		const tm=Date.now();

		if (tm>this.sw_header.time){
			this.switch_header();			
			this.sw_header.time=tm+12000;
			this.sw_header.index=(this.sw_header.index+1)%this.sw_header.header_list.length;
			this.switch_header();
		}


	},
		
	async switch_header(){
		
		await anim2.add(objects.lobby_header,{y:[objects.lobby_header.sy, -60],alpha:[1,0]},false,1,'linear',false);	
		objects.lobby_header.text=this.sw_header.header_list[this.sw_header.index];		
		anim2.add(objects.lobby_header,{y:[-60,objects.lobby_header.sy],alpha:[0,1]},true,1,'linear',false);	

		
	},
	
	wheel_event(dir) {
		
	},
	
	async fb_my_down() {
		
		
		if (this._opp_data.uid !== my_data.uid || objects.feedback_cont.visible === true)
			return;
		
		let fb = await feedback.show(this._opp_data.uid);
		
		//перезагружаем отзывы если добавили один
		if (fb[0] === 'sent') {
			let fb_id = irnd(0,50);			
			await fbs.ref("fb/"+this._opp_data.uid+"/"+fb_id).set([fb[1], firebase.database.ServerValue.TIMESTAMP, my_data.name]);
			this.show_feedbacks(this._opp_data.uid);			
		}
		
	},

	close_invite_dialog() {

		sound.play('close');

		if (objects.invite_cont.visible===false)
			return;

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=='') {
			fbs.ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player='';
		}

		anim2.add(objects.invite_cont,{scale_y:[1, 0]}, false, 0.15,'linear');
	},

	async send_invite() {


		if (objects.invite_cont.ready===false || objects.invite_cont.visible===false)
			return;

		if (anim2.any_on() === true) {
			sound.play('locked');
			return
		};

		if (lobby._opp_data.uid==="BOT")
		{
			await this.close();
			
			//заполняем данные бот-оппонента
			make_text(objects.opp_card_name,lobby._opp_data.name,160);
			objects.opp_card_rating.text='1400';
			objects.opp_avatar.texture=objects.invite_avatar.texture;	
			
			game.activate(bot_game, 'master');
		}
		else
		{
			sound.play('click');
			objects.invite_button_title.text=['Ждите ответ..','Waiting...'][LANG];
			fbs.ref("inbox/"+lobby._opp_data.uid).set({sender:my_data.uid,message:"INV",tm:Date.now()});
			pending_player=lobby._opp_data.uid;

		}

	},

	rejected_invite: function() {

		this.rejected_invites[pending_player]=Date.now();
		pending_player="";
		lobby._opp_data={};
		this.close_invite_dialog();
		big_message.show(['Соперник отказался от игры. Повторить приглашение можно через 1 минуту.','The opponent refused to play. You can repeat the invitation in 1 minute'][LANG],'---');


	},

	async accepted_invite(data) {

		//убираем запрос на игру если он открыт
		req_dialog.hide();
		
		//устанаваем окончательные данные оппонента
		opp_data=lobby._opp_data;
		
		//сразу карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,160);
		objects.opp_card_rating.text=opp_data.rating;
		objects.opp_avatar.texture=objects.invite_avatar.texture;		

		//закрываем меню и начинаем игру
		await lobby.close();
		game.activate(online_game, 'master',data.opp_conf,data.my_conf,data.seed);

	},

	swipe_down(dir){
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		const cur_x=objects.cards_cont.x;
		const new_x=cur_x-dir*450;
		
		if (new_x>0 || new_x<-450) {
			sound.play('locked');
			return
		}
		
		anim2.add(objects.cards_cont,{x:[cur_x, new_x]},true,0.2,'easeInOutCubic');
	},

	exit_lobby_down: async function() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		main_menu.activate();

	}

}

stickers={
	
	promise_resolve_send :0,
	promise_resolve_recive :0,

	show_panel() {


		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};


		//if (objects.stickers_cont.ready===false)
		//	return;
		sound.play('click');


		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{scale_y:[0, 1]}, true, 0.15,'linear');

	},

	hide_panel() {

		sound.play('close');

		if (objects.stickers_cont.ready===false)
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{scale_y:[1, 0]}, false, 0.15,'linear');

	},

	async send(id) {

		if (objects.stickers_cont.ready===false)
			return;
		
		if (this.promise_resolve_send!==0)
			this.promise_resolve_send('forced');

		this.hide_panel();
		sound.play('sent_sticker');

		fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'MSG',tm:Date.now(),data:id});

		//показываем какой стикер мы отправили
		objects.sticker.texture=gres['sticker_texture_'+id].texture;
		objects.sticker_area_bcg.texture=gres['sticker_area_left_bcg'].texture;
		
		await anim2.add(objects.sticker_area_cont,{alpha:[0, 1]}, true, 0.25,'linear');
		
		let res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_send = resolve;
				setTimeout(resolve, 3000)
			}
		);
		
		if (res === 'forced')
			return;

		await anim2.add(objects.sticker_area_cont,{alpha:[1, 0]}, false, 0.5,'linear');
	},

	async receive(id) {

		
		if (this.promise_resolve_recive!==0)
			this.promise_resolve_recive('forced');

		//воспроизводим соответствующий звук
		sound.play('receive_sticker');

		//показываем какой стикер мы отправили
		objects.sticker.texture=gres['sticker_texture_'+id].texture;
		objects.sticker_area_bcg.texture=gres['sticker_area_right_bcg'].texture;
	
		await anim2.add(objects.sticker_area_cont,{alpha:[0, 1]}, true, 0.25,'linear');

		let res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_recive = resolve;
				setTimeout(resolve, 3000)
			}
		);
		
		if (res === 'forced')
			return;

		await anim2.add(objects.sticker_area_cont,{alpha:[1, 0]}, false, 0.5,'linear');

	}

}

auth2={
	
	my_games_user_profile_resolve : {},
	my_games_login_status_resolve : {},
	my_games_register_user_resolve : {},
	ok_resolve : {},
	
	get_mygames_user_data : function() {
		
		return new Promise(function(resolve, reject){			
			auth2.my_games_user_profile_resolve = resolve;
			my_games_api.userProfile();	  
		});	
		
	},
	
	get_mygames_login_status : function() {
		
		return new Promise(function(resolve, reject){			
			auth2.my_games_login_status_resolve = resolve;
			my_games_api.getLoginStatus();	  
		});	
		
	},
	
	register_mygames_user : function() {
		
		return new Promise(function(resolve, reject){			
			auth2.my_games_register_user_resolve = resolve;
			my_games_api.registerUser();	  
		});	
		
	},
	
	load_script : function(src) {
	  return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.type = 'text/javascript'
		script.onload = resolve
		script.onerror = reject
		script.src = src
		document.head.appendChild(script)
	  })
	},
			
	get_random_char : function() {		
		
		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		return chars[irnd(0,chars.length-1)];
		
	},
	
	get_random_uid_for_local : function(prefix) {
		
		let uid = prefix;
		for ( let c = 0 ; c < 12 ; c++ )
			uid += this.get_random_char();
		
		//сохраняем этот uid в локальном хранилище
		try {
			localStorage.setItem('poker_uid', uid);
		} catch (e) {alert(e)}
					
		return uid;
		
	},
	
	get_random_name : function(uid) {
		
		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		const rnd_names = ['Gamma','Chime','Dron','Perl','Onyx','Asti','Wolf','Roll','Lime','Cosy','Hot','Kent','Pony','Baker','Super','ZigZag','Magik','Alpha','Beta','Foxy','Fazer','King','Kid','Rock'];
		
		if (uid !== undefined) {
			
			let e_num1 = chars.indexOf(uid[3]) + chars.indexOf(uid[4]) + chars.indexOf(uid[5]) + chars.indexOf(uid[6]);
			e_num1 = Math.abs(e_num1) % (rnd_names.length - 1);				
			let name_postfix = chars.indexOf(uid[7]).toString() + chars.indexOf(uid[8]).toString() + chars.indexOf(uid[9]).toString() ;	
			return rnd_names[e_num1] + name_postfix.substring(0, 3);					
			
		} else {

			let rnd_num = irnd(0, rnd_names.length - 1);
			let rand_uid = irnd(0, 999999)+ 100;
			let name_postfix = rand_uid.toString().substring(0, 3);
			let name =	rnd_names[rnd_num] + name_postfix;				
			return name;
		}	
	},	
	
	get_country_code : async function() {
		
		let country_code = ''
		try {
			let resp1 = await fetch("https://ipinfo.io/json");
			let resp2 = await resp1.json();			
			country_code = resp2.country;			
		} catch(e){}

		return country_code;
		
	},
	
	search_in_local_storage : function() {
		
		//ищем в локальном хранилище
		let local_uid = null;
		
		try {
			local_uid = localStorage.getItem('poker_uid');
		} catch (e) {alert(e)}
				
		if (local_uid !== null) return local_uid;
		
		return undefined;	
		
	},
	
	init : async function() {	
				
		if (game_platform === 'YANDEX') {			
		
			try {await this.load_script('https://yandex.ru/games/sdk/v2')} catch (e) {alert(e)};										
					
			let _player;
			
			try {
				window.ysdk = await YaGames.init({});			
				_player = await window.ysdk.getPlayer();
			} catch (e) { alert(e)};
			
			my_data.uid = _player.getUniqueID().replace(/[\/+=]/g, '');
			my_data.name = _player.getName();
			my_data.pic_url = _player.getPhoto('medium');
			
			if (my_data.pic_url === 'https://games-sdk.yandex.ru/games/api/sdk/v1/player/avatar/0/islands-retina-medium')
				my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';
			
			if (my_data.name === '')
				my_data.name = this.get_random_name(my_data.uid);
			
			//если английский яндекс до добавляем к имени страну
			let country_code = await this.get_country_code();
			my_data.name = my_data.name + ' (' + country_code + ')';			


			
			return;
		}
		
		if (game_platform === 'VK') {
			
			try {await this.load_script('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')} catch (e) {alert(e)};
			
			let _player;
			
			try {
				await vkBridge.send('VKWebAppInit');
				_player = await vkBridge.send('VKWebAppGetUserInfo');				
			} catch (e) {alert(e)};
			
			my_data.name 	= _player.first_name + ' ' + _player.last_name;
			my_data.uid 	= "vk"+_player.id;
			my_data.pic_url = _player.photo_100;
			
			return;			
		}
		
		if (game_platform === 'GOOGLE_PLAY') {	
		
			let country_code = await this.get_country_code();
			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('GP_');
			my_data.name = this.get_random_name(my_data.uid) + ' (' + country_code + ')';
			my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';	
			return;
		}
		
		if (game_platform === 'MY_GAMES') {	

			game_platform = 'MY_GAMES';
			
			try {await this.load_script('//store.my.games/app/19671/static/mailru.core.js')} catch (e) {alert(e)};													
			try {my_games_api = await window.iframeApi({
				appid: 19671,
				getLoginStatusCallback: function(status) {auth2.my_games_login_status_resolve(status)},
				userInfoCallback: function(info) {},
				userProfileCallback: function(profile) {auth2.my_games_user_profile_resolve(profile)},
				registerUserCallback: function(info) {auth2.my_games_register_user_resolve(info)},
				paymentFrameUrlCallback: function(url) {},
				getAuthTokenCallback: function(token) {},
				paymentReceivedCallback: function(data) {},
				paymentWindowClosedCallback: function() {},
				userConfirmCallback: function() {},
				paymentFrameItem: function(object) {},
				adsCallback: function(context) {console.log(context)}
			})} catch (e) {alert(e)};	
					
					
			let res = await this.get_mygames_login_status();
			console.log(res);
			if (res.loginStatus ===0) {
				my_games_api.authUser();				
				return;				
			}
			
			let player_data;
			if (res.loginStatus ===1)
				await this.register_mygames_user();	
				
			player_data = await this.get_mygames_user_data();			

	
			console.log(player_data);
			
			my_data.uid = 'MG_' + player_data.uid;
			my_data.name = player_data.nick;
			my_data.pic_url = player_data.avatar;	
			
		}
		
		if (game_platform === 'DEBUG') {		

			my_data.name = my_data.uid = 'debug' + prompt('Отладка. Введите ID', 100);
			my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';		
			return;
		}
		
		if (game_platform === 'CRAZYGAMES') {
			
			let country_code = await this.get_country_code();
			try {await this.load_script('https://sdk.crazygames.com/crazygames-sdk-v1.js')} catch (e) {alert(e)};			
			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('CG_');
			my_data.name = this.get_random_name(my_data.uid) + ' (' + country_code + ')';
			my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';	
			let crazysdk = window.CrazyGames.CrazySDK.getInstance();
			crazysdk.init();			
			return;
		}
		
		if (game_platform === 'UNKNOWN') {
			
			//если не нашли платформу
			alert('Неизвестная платформа. Кто Вы?')
			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('LS_');
			my_data.name = this.get_random_name(my_data.uid);
			my_data.pic_url = 'https://avatars.dicebear.com/api/adventurer/' + my_data.uid + '.svg';	
		}
	}
	
}

function resize() {
    const vpw = window.innerWidth;  // Width of the viewport
    const vph = window.innerHeight; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height

    if (vph / vpw < M_HEIGHT / M_WIDTH) {
      nvh = vph;
      nvw = (nvh * M_WIDTH) / M_HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * M_HEIGHT) / M_WIDTH;
    }
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
}

function set_state(params) {


	if (params.state!==undefined)
		state=params.state;

	if (params.hidden!==undefined)
		h_state=+params.hidden;

	let small_opp_id="";
	if (opp_data.uid!==undefined)
		small_opp_id=opp_data.uid.substring(0,10);

	fbs.ref(room_name+"/"+my_data.uid).set({state:state, name:my_data.name, rating : my_data.rating, hidden:h_state, opp_id : small_opp_id});

}

function vis_change() {

	if (document.hidden) {
		hidden_state_start = Date.now();			
		PIXI.sound.pauseAll();	
	} else {
		PIXI.sound.resumeAll();	
	}
	
	set_state({hidden : document.hidden});
		
}

language_dialog={
	
	p_resolve : {},
	
	show : function() {
				
		return new Promise(function(resolve, reject){

			document.body.innerHTML='<style>		html,		body {		margin: 0;		padding: 0;		height: 100%;	}		body {		display: flex;		align-items: center;		justify-content: center;		background-color: rgba(0,0,0,1);		flex-direction: column	}		.two_buttons_area {	  width: 70%;	  height: 50%;	  margin: 20px 20px 0px 20px;	  display: flex;	  flex-direction: row;	}		.button {		margin: 5px 5px 5px 5px;		width: 50%;		height: 100%;		color:white;		display: block;		background-color: rgba(44,55,66,1);		font-size: 10vw;		padding: 0px;	}  	#m_progress {	  background: rgba(100,100,100,0.1);	  justify-content: flex-start;	  border-radius: 100px;	  align-items: center;	  position: relative;	  padding: 0 5px;	  display: none;	  height: 50px;	  width: 70%;	}	#m_bar {	  box-shadow: 0 10px 40px -10px #fff;	  border-radius: 100px;	  background: #fff;	  height: 70%;	  width: 0%;	}	</style><div id ="two_buttons" class="two_buttons_area">	<button class="button" id ="but_ref1" onclick="language_dialog.p_resolve(0)">RUS</button>	<button class="button" id ="but_ref2"  onclick="language_dialog.p_resolve(1)">ENG</button></div><div id="m_progress">  <div id="m_bar"></div></div>';
			
			language_dialog.p_resolve = resolve;	
						
		})
		
	}
	
}

async function define_platform_and_language() {
	
	let s = window.location.href;
	
	if (s.includes('yandex')) {
		
		game_platform = 'YANDEX';
		
		if (s.match(/yandex\.ru|yandex\.by|yandex\.kg|yandex\.kz|yandex\.tj|yandex\.ua|yandex\.uz/))
			LANG = 0;
		else 
			LANG = 1;		
		return;
	}
	
	if (s.includes('vk.com')) {
		game_platform = 'VK';	
		LANG = 0;	
		return;
	}
			
	if (s.includes('google_play')) {
			
		game_platform = 'GOOGLE_PLAY';	
		LANG = await language_dialog.show();
		return;
	}	

	if (s.includes('my_games')) {
			
		game_platform = 'MY_GAMES';	
		LANG = 0;
		return;	
	}	
	
	if (s.includes('192.168')) {
			
		game_platform = 'DEBUG';	
		LANG = await language_dialog.show();
		return;	
	}	
	
	game_platform = 'UNKNOWN';	
	LANG = await language_dialog.show();
	document.getElementById('m_progress').outerHTML = "";	
	
	

}

async function init_game_env(lang) {
				
	
	await define_platform_and_language();
	console.log(game_platform, LANG);
						
	document.body.innerHTML='<style>html,body {margin: 0;padding: 0;height: 100%;	}body {display: flex;align-items: center;justify-content: center;background-color: rgba(32,32,81,1);flex-direction: column	}</style></div><div id="m_progress">  <div id="m_bar"></div></div>';
	
	//Сцена и пикси
	app = new PIXI.Application({width:M_WIDTH, height:M_HEIGHT,antialias:false,backgroundColor : 0x152543});
	const c = document.body.appendChild(app.view);
	c.style["boxShadow"] = "0 0 15px #000000";
		
	//события изменения окна
	resize();
	window.addEventListener('resize', resize);

	//запускаем главный цикл
	main_loop();

	await load_resources();

	await auth2.init();
	
	//инициируем файербейс
	if (firebase.apps.length===0) {
		firebase.initializeApp({			
			apiKey: "AIzaSyBfHebuLYgHeahTX4wLV7KjB61YQdTvAEM",
			authDomain: "sea-battle-dfa0b.firebaseapp.com",
			databaseURL: "https://sea-battle-dfa0b-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "sea-battle-dfa0b",
			storageBucket: "sea-battle-dfa0b.appspot.com",
			messagingSenderId: "431426396264",
			appId: "1:431426396264:web:8f451bd74ee88b725d5bdd"		
		});
	}
	
	fbs=firebase.database();
	
	//идентификатор клиента
	client_id = irnd(10,999999);

    //создаем спрайты и массивы спрайтов и запускаем первую часть кода
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(game_res.resources[obj_name].texture);
            eval(load_list[i].code0);
            break;

        case "block":
            eval(load_list[i].code0);
            break;

        case "cont":
            eval(load_list[i].code0);
            break;

        case "array":
			var a_size=load_list[i].size;
			objects[obj_name]=[];
			for (var n=0;n<a_size;n++)
				eval(load_list[i].code0);
            break;
        }
    }

    //обрабатываем вторую часть кода в объектах
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)
		
		
        switch (obj_class) {
        case "sprite":
            eval(load_list[i].code1);
            break;

        case "block":
            eval(load_list[i].code1);
            break;

        case "cont":	
			eval(load_list[i].code1);
            break;

        case "array":
			var a_size=load_list[i].size;
				for (var n=0;n<a_size;n++)
					eval(load_list[i].code1);	;
            break;
        }
    }


	
	//айди
	anim2.add(objects.id_cont,{scale_y:[0,1]}, true, 0.15,'linear');
	some_process.loup_anim=function() {
		objects.id_loup.x=20*Math.sin(game_tick*8)+90;
		objects.id_loup.y=20*Math.cos(game_tick*8)+150;
	}


	//загружаем аватарку игрока
	let loader=new PIXI.Loader();
	await new Promise(function(resolve, reject) {		
		loader.add("my_avatar", my_data.pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});
		loader.load(function(l,r) {	resolve(l)});
	});

	//устанавливаем фотки в попап и другие карточки
	objects.id_avatar.texture=objects.my_avatar.texture=loader.resources.my_avatar.texture;

	//это разные события
	document.addEventListener("visibilitychange", vis_change);
	
	//загружаем остальные данные из файербейса
	let _other_data = await fbs.ref("players/" + my_data.uid).once('value');
	let other_data = _other_data.val();

	//сервисное сообщение
	if(other_data && other_data.s_msg){
		message.add(other_data.s_msg);
		fbs.ref("players/"+my_data.uid+"/s_msg").remove();
	}

	my_data.rating = (other_data && other_data.rating) || 1400;
	my_data.games = (other_data && other_data.games) || 0;
	my_data.name = (other_data && other_data.name) || my_data.name;
	my_data.arms = (other_data && other_data.arms) || {'combo_0':999,'combo_332':15,'combo_324':15};
	my_data.money = (other_data && other_data.money) || 100;
		
	//my_data.arms={'combo_0':999,'combo_332':15,'combo_324':15};
		
	//устанавлием имена
	make_text(objects.id_name,my_data.name,150);
	make_text(objects.my_card_name,my_data.name,150);
			
	//номер комнаты
	room_name= 'states';	
	
	//это путь к чату
	chat_path='states_chat';
	
	//устанавливаем рейтинг в попап
	objects.id_rating.text=objects.my_card_rating.text=my_data.rating;

	//убираем лупу
	some_process.loup_anim = function(){};
	objects.id_loup.visible=false;

	//обновляем почтовый ящик
	fbs.ref("inbox/"+my_data.uid).set({sender:"-",message:"-",tm:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

	//подписываемся на новые сообщения
	fbs.ref("inbox/"+my_data.uid).on('value', (snapshot) => { process_new_message(snapshot.val());});

	//обновляем данные в файербейс так как могли поменяться имя или фото
	fbs.ref("players/"+my_data.uid+"/name").set(my_data.name);
	fbs.ref("players/"+my_data.uid+"/pic_url").set(my_data.pic_url);
	fbs.ref("players/"+my_data.uid+"/rating").set(my_data.rating);
	fbs.ref("players/"+my_data.uid+"/games").set(my_data.games);
	fbs.ref("players/"+my_data.uid+"/money").set(my_data.money);
	fbs.ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
		
		
	//устанавливаем мой статус в онлайн
	set_state({state : 'o'});
	
	//сообщение для дубликатов
	fbs.ref("inbox/"+my_data.uid).set({message:"CLIEND_ID",tm:Date.now(),client_id:client_id});

	//отключение от игры и удаление не нужного
	fbs.ref("inbox/"+my_data.uid).onDisconnect().remove();
	fbs.ref(room_name+"/"+my_data.uid).onDisconnect().remove();


	//keep-alive сервис
	setInterval(function()	{keep_alive()}, 40000);


	//контроль за присутсвием
	var connected_control = fbs.ref(".info/connected");
	connected_control.on("value", (snap) => {
	  if (snap.val() === true) {
		connected = 1;
	  } else {
		connected = 0;
	  }
	});
	

	//показыаем основное меню
	main_menu.activate();
	
	await anim2.wait(2);
	anim2.add(objects.id_cont,{scale_y:[1,0]}, false, 0.15,'linear');
	

}

async function loading_elements(){
		
	game_res.add('loading_text',git_src+'res/LOADING/loading_text.png');
	game_res.add('complete_text',git_src+'res/LOADING/complete_text.png');
	await new Promise((resolve, reject)=> game_res.load(resolve))
		
	const lw=250;
	const lh=40;
	const sx=450/2;
	const sy=800/2;
		
	objects.loading_bcg=new PIXI.Sprite(PIXI.Texture.WHITE);
	objects.loading_bcg.width=lw;
	objects.loading_bcg.height=lh;
	objects.loading_bcg.anchor.set(0.5,0.5);
	objects.loading_bcg.tint=0x000022;	
	
	objects.loading_text=new PIXI.Sprite(gres.loading_text.texture);
	objects.loading_text.width=lw;
	objects.loading_text.height=lh;
	objects.loading_text.anchor.set(0.5,0.5);
	
	objects.loading_front=new PIXI.Sprite(PIXI.Texture.WHITE);
	objects.loading_front.width=0;
	objects.loading_front.height=lh;
	objects.loading_front.alpha=0.54;
	objects.loading_front.tint=0x01AEBB;	
	objects.loading_front.anchor.set(0.5,0.5);
	
	objects.preloading_cont=new PIXI.Container();
	objects.preloading_cont.addChild(objects.loading_bcg,objects.loading_text,objects.loading_front);
	objects.preloading_cont.x=sx;
	objects.preloading_cont.y=sy;
		
	app.stage.addChild(objects.preloading_cont);
	
	
}

async function load_resources() {


	git_src='https://akukamil.github.io/sea_battle/'
	//git_src=''

	//подпапка с ресурсами
	let lang_pack = ['RUS','ENG'][LANG];	
	
	//все ресурсы и короткое обращение к ним	
	game_res=new PIXI.Loader();
	gres=game_res.resources;	
	
	await loading_elements();	
	
	
	game_res.add('m2_font', git_src+'fonts/balsamic/font.fnt');

	game_res.add('receive_move',git_src+'sounds/receive_move.mp3');
	game_res.add('note',git_src+'sounds/note.mp3');
	game_res.add('receive_sticker',git_src+'sounds/receive_sticker.mp3');
	game_res.add('message',git_src+'sounds/message.mp3');
	game_res.add('lose',git_src+'sounds/lose.mp3');
	game_res.add('win',git_src+'sounds/win.mp3');
	game_res.add('click',git_src+'sounds/click.mp3');
	game_res.add('close',git_src+'sounds/close.mp3');
	game_res.add('splash',git_src+'sounds/splash.mp3');
	game_res.add('locked',git_src+'sounds/locked.mp3');
	game_res.add('clock',git_src+'sounds/clock.mp3');
	game_res.add('expl',git_src+'sounds/expl.mp3');
	game_res.add('keypress',git_src+'sounds/keypress.mp3');
	game_res.add('money',git_src+'sounds/money.mp3');
	game_res.add('bonus',git_src+'sounds/bonus.mp3');
	game_res.add('sos',git_src+'sounds/sos.mp3');
	game_res.add('music',git_src+'sounds/music.mp3');
	game_res.add('sent_sticker',git_src+'sounds/sent_sticker.mp3');
	game_res.add('click2',git_src+'sounds/click2.mp3');
	
    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class==='sprite'||load_list[i].class === 'image')
            game_res.add(load_list[i].name, git_src+'res/'+lang_pack+'/'+load_list[i].name+'.'+load_list[i].image_format);		

	//добавляем текстуры стикеров
	for (var i=0;i<16;i++)
		game_res.add('sticker_texture_'+i, git_src+'stickers/'+i+'.png');
	
	//загружаем взрывы
	for (var i=0;i<20;i++)
		game_res.add('exp'+i, git_src+'res/explosion/'+(i+8)+'.png');

	//прогресс
	game_res.onProgress.add(function(loader, resource) {
		objects.loading_front.width=loader.progress*2.5;
	});
		
	await new Promise((resolve, reject)=> game_res.load(resolve))
	objects.loading_text.texture=gres.complete_text.texture;
	await new Promise(resolve => setTimeout(resolve, 1000));
	await anim2.add(objects.preloading_cont,{scale_y:[1,0]}, false, 0.25,'linear');		

}

function main_loop() {

	//обрабатываем минипроцессы
	for (let key in some_process)
		some_process[key]();	
	
	//objects.invite_cont.rotation+=0.01;
	
	game_tick+=0.016666666;
	anim2.process();
	requestAnimationFrame(main_loop);
}
