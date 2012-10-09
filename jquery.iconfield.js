(function( $ ) {

	var methods = {
		refresh : function( ) {
			return this.each( function() {

				var $this = $(this),
					data = $this.data( 'iconfield' ),
					image = new Image();

				image.onload = function( ) {

					var style_map = {
						'background-image'		:	'url(' + data['image-url'] + ')',
						'background-repeat'		:	'no-repeat',
						'background-position'	:	data['horizontal-padding'] + 'px center',
						'padding-left'			:	image.width + data['horizontal-padding'] * 2,
					};

					// calculate the minimal height this textfield should take,
					// taking into account the image's height and paddings beneath and above it
					var minimal_height = (image.height + data['vertical-padding'] * 2);
					var current_height = Number($this.css( 'height' ).slice(0, -2))

					// add padding if the field's current height is not high enough to include the image
					if( current_height < minimal_height ) {
						var padding = (minimal_height - current_height) / 2;
						$.extend( style_map, {
							'padding-top'		:	padding,
							'padding-bottom'	:	padding,
						} );
					}
					
					// update the field's style
					$this.css( style_map );
				}

				image.src = data['image-url'];

			} );

		},

		init : function( options ) {

			return this.each( function() {

				var $this = $(this);

				// initialize the element's iconfield data with the defaults
				$this.data( 'iconfield', new Object() );
				$this.iconfield( 'option', $.extend( {
					'horizontal-padding'	:	2,
					'vertical-padding'		:	4
				}, options ) );

				// refresh the styling
				$this.iconfield( 'refresh' )

			} );

		},

		option : function( name, value ) {

			return $.access( this, function( elem, name, value ) {
				var $this = $(elem),
					data = $this.data('iconfield');

				if( value !== undefined ) {
					data[name] = value;
				} else {
					return data[name];
				}
			}, name, value, arguments.length > 1 );

		}
	}

	$.fn.iconfield = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		}
		else {
			$.error( 'Method ' + method + ' does not exist on jQuery.iconfield' );
		}
	}

})(jQuery);
