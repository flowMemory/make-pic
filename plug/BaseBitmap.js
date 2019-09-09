/**
 * Created by ajex on 2017/3/28.
 */
//图形基类
var Soul = Soul||{};
(function() {
    function BaseBitmap(source,width,height){
        this.Bitmap_constructor(source);
        if(width&&height)
        {
            this.setBounds(0,0,width,height)
            this._width = width;
            this._height = height;
        }
        this.destoryed = false;
    }
    var p = createjs.extend(BaseBitmap,createjs.Bitmap);
    p._getWidth = function ()
    {
        var bounds = this.getRealSize(this);
        if(!bounds) return 0;
        this._width = bounds.width;
        return this._width/this.getRealScale().scaleX;
    }
    p._setWidth = function (value)
    {
        this.setRealWidth(this,value);
        this._width = value;
    }
    p._getHeight = function ()
    {
        var bounds = this.getRealSize(this);
        if(!bounds) return 0;
        this._height = bounds.height;
        return this._height/this.getRealScale().scaleY;
    }
    p._setHeight = function (value)
    {
        this.setRealHeight(this,value);
        this._height = value;
    }
    Object.defineProperties(p, {
        width: { get: p._getWidth, set: p._setWidth },
        height: { get: p._getHeight, set: p._setHeight }
    });
    p.destory = function ()
    {
        if (this.destoryed == true)
            return;
        this.removeAllEventListeners();
        if (this.parent)
            this.parent.removeChild(this);

        this.destoryed = true;
    }
    p.getRealSize = function (display)
    {
        var matrix;
        if(display.parent)
        {
            matrix = display.parent.getConcatenatedMatrix();
        }
        else
        {
            matrix = new createjs.Matrix2D(1,0,0,1,0,0)
        }
        var bounds = display._getBounds(matrix);
        return bounds;
    }
    p.setRealWidth = function (display,width)
    {
        var bounds = this.getRealSize(display)
        if(bounds.width && bounds.width!=0)
        {
            display.scaleX =  display.scaleX*width/bounds.width;
        }
    }
    p.setRealHeight = function (display,height)
    {
        var bounds = this.getRealSize(display)
        if(bounds.height && bounds.height!=0)
        {
            display.scaleY = display.scaleY*height/bounds.height;
        }
    }
    p.getRealScale = function ()
    {
        var scaleX = 1;
        var scaleY = 1;
        var obj = this;
        while(obj.parent)
        {
            scaleX = scaleX*obj.parent.scaleX;
            scaleY = scaleY*obj.parent.scaleY;
            obj = obj.parent;
        }
        return {"scaleX":scaleX,"scaleY":scaleY}
    }
    Soul.BaseBitmap = createjs.promote(BaseBitmap, "Bitmap");
}());