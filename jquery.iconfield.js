(function( $ ) {

	var methods = {
		isEventOnIcon : function( e ) {

			var $this = $(this),

				data = $this.data( 'iconfield' ),
				left = _.isUndefined( data['left'] ) || data['left'],

				// calculate the x and y relative to the text field
				x = e.pageX - $this.position().left,
				y = e.pageY - $this.position().top,

				// get dimensions from options
				horizontalPadding = $this.iconfield( 'option', 'horizontal-padding' ),
				verticalPadding = $this.iconfield( 'option', 'vertical-padding' ),
				imageWidth = $this.iconfield( 'option', 'image-width' ),
				imageHeight = $this.iconfield( 'option', 'image-height' );

				// calculate the offset of the left side of the icon
				horizontalOffset = left ?
								   horizontalPadding :
								   $this.width() - horizontalPadding - imageWidth;

			return (
				(x >= horizontalOffset && x <= horizontalOffset + imageWidth)
				&&
				(y >= verticalPadding && y <= verticalPadding + imageHeight)
			);

		},

		refresh : function( ) {

			return this.each( function( ) {
				var $this = $(this),
					data = $this.data( 'iconfield' ),
					image = new Image( );


				// about to load the image so we can find out what the image's dimensions are

				image.onload = function( ) {

					var left = data['left'],
						x_padding = data['horizontal-padding'],
						y_padding = data['vertical-padding'],
						bg_position = left ?
									  x_padding : 
									  $this.width() - x_padding * 2 - image.width;

					var style_map = {
						'background-image'		:	'url(' + data['image-url'] + ')',
						'background-repeat'		:	'no-repeat',
						'background-position'	:	bg_position + 'px center',
					};

					if (left) {
						style_map['padding-left'] = image.width + x_padding * 2;
					}
					else {
						style_map['padding-left'] = x_padding
						style_map['padding-right'] = x_padding;
					}

					if( data['old-cursor'] ) {
						style_map['cursor'] = data['old-cursor'];
					}

					// calculate the minimal height this textfield should take,
					// taking into account the image's height and paddings beneath and above it
					var minimal_height = (image.height + y_padding * 2);
					var current_height = Number($this.css( 'height' ).slice(0, -2))

					// add padding if the field's current height is not high enough to include the image
					// (+ vertical padding)
					if( current_height < minimal_height ) {
						// the padding is the difference between the minimal height and the current height
						// divided by two, because one half goes to the bottom and one to the top
						var padding = (minimal_height - current_height) / 2;
						$.extend( style_map, {
							'padding-top'		:	padding,
							'padding-bottom'	:	padding,
						} );
					}

					// add image dimensions to the data stored for this element
					$.extend( data, {
						'image-width'	:	image.width,
						'image-height'	:	image.height
					} );
					
					// update the field's style
					$this.css( style_map );
				}

				image.src = data['image-url'];

			} );

		},

		init : function( options ) {

			return this.each( function( ) {

				var $this = $(this);

				// initialize the element's iconfield data with the defaults
				$this.data( 'iconfield', new Object() );
				$this.iconfield( 'option', $.extend( {
					'horizontal-padding'	:	2,
					'vertical-padding'		:	4,
					'icon-cursor'			:	'auto',
					'left'					:	true,
				}, options ) );

				// create a custom event that is triggered when the icon is clicked
				$this.on( 'click', function( e ) {
					if($this.iconfield( 'isEventOnIcon', e ) ) {
						$this.trigger( 'iconfield.click' );
					}
				} );

				// bind to mousemove for simulating mouseenter and mouseleave events
				$this.on( 'mousemove', function( e ) {
					var data = $this.data( 'iconfield' ),
						wasOnIcon = data['was-on-icon'] ? data['was-on-icon'] : false,
						curOnIcon = $this.iconfield( 'isEventOnIcon', e );

					// this is obvious
					$this.trigger( 'iconfield.mousemove' );

					// if the mouse is on the icon and wasn't before, or vice versa,
					// trigger the relevant event and store the current state of
					// the mouse
					if( curOnIcon != wasOnIcon ) {
						if( curOnIcon && !wasOnIcon ) {
							$this.trigger( 'iconfield.mouseenter' );
						}
						else if( !curOnIcon && wasOnIcon ) {
							$this.trigger( 'iconfield.mouseleave' );
						}

						data['was-on-icon'] = curOnIcon;
					}
				} );

				// bind to our simulated mouseenter event to change the cursor
				// when the mouse is hovering over the icon
				$this.on( 'iconfield.mouseenter', function( e ) {
					var data = $this.data( 'iconfield' ),
						curCursor = $this.css( 'cursor' );

					// 'auto' means that no special cursor was specified by the user
					if( data['icon-cursor'] != 'auto' &&
						data['icon-cursor'] != curCursor) {
						// save the cursor before it's changed
						data['old-cursor'] = curCursor ? curCursor : 'auto';

						// change the cursor
						$this.css( 'cursor', data['icon-cursor'] );
					}
				} );

				// change the icon back to normal
				$this.on( 'iconfield.mouseleave', function( e ) {
					var data = $this.data( 'iconfield' );

					// 'auto' means that no special cursor was specified by the user,
					// meaning that there is nothing to change back to
					if( data['icon-cursor'] != 'auto' ) {
						// if no old cursor was stored (meaning that the mouse was never on the icon)
						// change back to 'auto'
						$this.css( 'cursor', data['old-cursor'] ? data['old-cursor'] : 'auto' );
					}
				} );

				// refresh the styling
				$this.iconfield( 'refresh' );

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
