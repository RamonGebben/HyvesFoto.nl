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
import { MobileGuideOpacitySlider } from '~/molecules/MobileGuideOpacitySlider';
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

  @media (max-width: 480px) {
    padding: ${props => props.theme.space.md};
    gap: ${props => props.theme.space.sm};
  }
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
  mobileGuideOpacity: number;
  onMobileGuideOpacityChange: (opacity: number) => void;
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
  mobileGuideOpacity,
  onMobileGuideOpacityChange,
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
        <Subtitle>
          <strong>HyvesFoto.nl</strong>
        </Subtitle>
        <Title>Jouw foto. Jouw uitsnede. Klaar voor Hyves.</Title>
        <Subtitle>
          Bepaal zelf wat er in beeld blijft. Snijd één foto bij of maak een
          raster van meerdere foto’s en upload het resultaat rechtstreeks naar
          Hyves.
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
                Tik op het vergroot-icoon voor meer ruimte om een foto te
                bewerken. Sleep of knijp in de collage om direct te schuiven en
                te zoomen. Versleep het handvat om foto’s te wisselen.
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
            mobileGuideOpacity={mobileGuideOpacity}
            onCropViewChange={onCropViewChange}
            onRemoveImage={onRemoveImage}
            onSwapImages={onSwapImages}
            isExporting={isExporting}
          />
          <CardHint>
            De getinte randen en streepjes laten zien hoeveel Hyves er op mobiel
            extra afsnijdt — hou het belangrijkste binnen de streepjes.
          </CardHint>
          <MobileGuideOpacitySlider
            opacity={mobileGuideOpacity}
            onChange={onMobileGuideOpacityChange}
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
