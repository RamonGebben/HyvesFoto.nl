'use client';

import { Download, RotateCcw } from 'lucide-react';
import styled from 'styled-components';

import { Button } from '~/atoms/Button';
import type { AspectRatioId, AspectRatioPreset } from '~/content/aspectRatios';
import type { CollageLayoutOption } from '~/content/collageLayouts';
import { AspectRatioPicker } from '~/molecules/AspectRatioPicker';
import { CollageLayoutPicker } from '~/molecules/CollageLayoutPicker';
import { Footer } from '~/molecules/Footer';
import { GapWidthSlider } from '~/molecules/GapWidthSlider';
import { CollageGrid } from '~/organisms/CollageGrid';
import { ImageDropzone } from '~/organisms/ImageDropzone';
import type { CropView } from '~/utils/computeCropRect';
import type { Ratio, Size } from '~/utils/geometry';
import type { CollageTile } from '~/utils/resolveCollageTiles';

/** The orange band across the top, as on Hyves itself. */
const Banner = styled.header`
  background: ${props => props.theme.gradient.brand};
  color: ${props => props.theme.color.accentContrast};
  padding: ${props => props.theme.space.lg} ${props => props.theme.space.md};
  border-bottom-left-radius: ${props => props.theme.radius.lg};
  border-bottom-right-radius: ${props => props.theme.radius.lg};
`;

const BannerInner = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.space.xs};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSize.xl};

  ${props => props.theme.mediaQuery.md} {
    font-size: ${props => props.theme.fontSize.xxl};
  }
`;

const Subtitle = styled.p`
  max-width: 60ch;
`;

const Main = styled.main`
  max-width: 48rem;
  margin: 0 auto;
  padding: ${props => props.theme.space.lg} ${props => props.theme.space.md}
    ${props => props.theme.space.xxl};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.space.lg};
`;

/** Every block of content sits on a white card, as the Hyves feed does. */
const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.space.md};
  padding: ${props => props.theme.space.lg};
  background: ${props => props.theme.color.surface};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: ${props => props.theme.shadow.md};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${props => props.theme.space.md};
`;

const CardTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.lg};
`;

const CardHint = styled.p`
  color: ${props => props.theme.color.textMuted};
  font-size: ${props => props.theme.fontSize.sm};
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${props => props.theme.space.md};
`;

export type EditorTemplateImage = {
  readonly id: string;
  readonly name: string;
  readonly previewUrl: string;
  readonly naturalSize?: Size;
  readonly cropView?: CropView;
};

export type EditorTemplateProps = {
  presets: readonly AspectRatioPreset[];
  selectedAspectRatioId: AspectRatioId;
  onSelectAspectRatio: (id: AspectRatioId) => void;
  outputRatio: Ratio;
  images: readonly EditorTemplateImage[];
  tiles: readonly CollageTile[];
  layoutOptions: readonly CollageLayoutOption[];
  selectedLayoutId: string | undefined;
  onSelectLayout: (id: string) => void;
  gapRatio: number;
  minGapRatio: number;
  maxGapRatio: number;
  onGapRatioChange: (gapRatio: number) => void;
  onFilesAccepted: (files: readonly File[]) => void;
  onRemoveImage: (id: string) => void;
  onCropViewChange: (id: string, view: CropView) => void;
  onSwapImages: (fromId: string, toId: string) => void;
  onExportCollage: () => void;
  onReset: () => void;
  isExporting: boolean;
};

export const EditorTemplate = ({
  presets,
  selectedAspectRatioId,
  onSelectAspectRatio,
  outputRatio,
  images,
  tiles,
  layoutOptions,
  selectedLayoutId,
  onSelectLayout,
  gapRatio,
  minGapRatio,
  maxGapRatio,
  onGapRatioChange,
  onFilesAccepted,
  onRemoveImage,
  onCropViewChange,
  onSwapImages,
  onExportCollage,
  onReset,
  isExporting,
}: EditorTemplateProps) => (
  <>
    <Banner>
      <BannerInner>
        <Title>Bijsnijden voor Hyves, zonder dat het mooiste eraf valt</Title>
        <Subtitle>
          Hyves snijdt tijdlijnfoto’s bij waar het zelf wil. Kies hier je eigen
          uitsnede, kies een rasterindeling voor meerdere foto’s samen, en
          upload iets dat meteen goed past.
        </Subtitle>
      </BannerInner>
    </Banner>

    <Main>
      {images.length === 0 ? (
        <Card>
          <AspectRatioPicker
            presets={presets}
            selectedId={selectedAspectRatioId}
            onSelect={onSelectAspectRatio}
          />
          <ImageDropzone onFilesAccepted={onFilesAccepted} />
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Jouw collage</CardTitle>
              <CardHint>
                Sleep, scroll of knijp in een foto om te verschuiven en te
                zoomen. Versleep het handvat bovenaan een foto om van plek te
                wisselen met een andere.
              </CardHint>
            </div>
            <Button
              variant="grey"
              size="sm"
              icon={<RotateCcw />}
              onClick={onReset}
            >
              Begin opnieuw
            </Button>
          </CardHeader>

          <Controls>
            <CollageLayoutPicker
              options={layoutOptions}
              selectedId={selectedLayoutId}
              outputRatio={outputRatio}
              onSelect={onSelectLayout}
            />
            <GapWidthSlider
              gapRatio={gapRatio}
              min={minGapRatio}
              max={maxGapRatio}
              onChange={onGapRatioChange}
            />
          </Controls>

          <CollageGrid
            images={images}
            tiles={tiles}
            outputRatio={outputRatio}
            onCropViewChange={onCropViewChange}
            onRemoveImage={onRemoveImage}
            onSwapImages={onSwapImages}
            isExporting={isExporting}
          />

          <Button
            icon={<Download />}
            onClick={onExportCollage}
            disabled={
              isExporting ||
              tiles.length !== images.length ||
              images.some(image => !image.naturalSize)
            }
          >
            {isExporting ? 'Bezig met exporteren…' : 'Collage exporteren'}
          </Button>
        </Card>
      )}
    </Main>

    <Footer />
  </>
);
