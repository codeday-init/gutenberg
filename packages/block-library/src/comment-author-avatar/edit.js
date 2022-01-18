/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	useBlockProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
} from '@wordpress/block-editor';
import { PanelBody, ResizableBox, RangeControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { __, isRTL } from '@wordpress/i18n';
import { SVG, Path } from '@wordpress/primitives';

export default function Edit( {
	attributes,
	context: { commentId },
	setAttributes,
	isSelected,
} ) {
	const { height, width } = attributes;

	const placeholderIllustration = (
		<SVG
			className="components-placeholder__illustration"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			preserveAspectRatio
		>
			<Path vectorEffect="non-scaling-stroke" d="M24 24 0 0" />
		</SVG>
	);

	const [ avatars ] = useEntityProp(
		'root',
		'comment',
		'author_avatar_urls',
		commentId
	);

	const [ authorName ] = useEntityProp(
		'root',
		'comment',
		'author_name',
		commentId
	);
	const avatarUrls = avatars ? Object.values( avatars ) : null;
	const sizes = avatars ? Object.keys( avatars ) : null;
	const minSize = sizes ? sizes[ 0 ] : 24;
	const maxSize = sizes ? sizes[ sizes.length - 1 ] : 96;
	const blockProps = useBlockProps();
	const spacingProps = useSpacingProps( attributes );
	const maxSizeBuffer = Math.floor( maxSize * 2.5 );

	const inspectorControls = (
		<InspectorControls>
			<PanelBody title={ __( 'Avatar Settings' ) }>
				<RangeControl
					label={ __( 'Image size' ) }
					onChange={ ( newWidth ) =>
						setAttributes( {
							width: newWidth,
							height: newWidth,
						} )
					}
					min={ minSize }
					max={ maxSizeBuffer }
					initialPosition={ width }
					value={ width }
				/>
			</PanelBody>
		</InspectorControls>
	);

	const displayAvatar = (
		<ResizableBox
			size={ {
				width,
				height,
			} }
			showHandle={ isSelected }
			onResizeStop={ ( event, direction, elt, delta ) => {
				setAttributes( {
					height: parseInt( height + delta.height, 10 ),
					width: parseInt( width + delta.width, 10 ),
				} );
			} }
			lockAspectRatio
			enable={ {
				top: false,
				right: ! isRTL(),
				bottom: true,
				left: isRTL(),
			} }
			minWidth={ minSize }
			maxWidth={ maxSizeBuffer }
		>
			{ avatarUrls ? (
				<img
					src={ avatarUrls[ avatarUrls.length - 1 ] }
					alt={ `${ authorName } ${ __( 'Avatar' ) }` }
					{ ...blockProps }
				/>
			) : (
				<div { ...blockProps }>{ placeholderIllustration }</div>
			) }
		</ResizableBox>
	);

	return (
		<>
			{ inspectorControls }
			<div { ...spacingProps }>{ displayAvatar }</div>
		</>
	);
}
