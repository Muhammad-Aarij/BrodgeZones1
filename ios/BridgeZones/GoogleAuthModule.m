#import "GoogleAuthModule.h"
#import <React/RCTLog.h>
#import <GoogleSignIn/GoogleSignIn.h>
#import <GTMSessionFetcher/GTMSessionFetcher.h>

@implementation GoogleAuthModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getGoogleAuthToken:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  // Load your service account file
  NSString *filePath = [[NSBundle mainBundle] pathForResource:@"service-account" ofType:@"json"];
  NSData *data = [NSData dataWithContentsOfFile:filePath];
  
  NSError *error;
  NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&error];
  
  if (error) {
    reject(@"file_error", @"Failed to load service account file", error);
    return;
  }

  NSString *clientEmail = json[@"client_email"];
  NSString *privateKey = json[@"private_key"];
  NSArray *scopes = @[ @"https://www.googleapis.com/auth/cloud-platform" ];

  GTMSessionFetcherService *fetcherService = [[GTMSessionFetcherService alloc] init];
  GIDGoogleUser *user = [GIDGoogleUser alloc];
  GIDAuthentication *auth = [user authentication];

  GTMSessionFetcher *fetcher = [fetcherService fetcherWithURLString:@"https://oauth2.googleapis.com/token"];
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:fetcher.request.URL];
  [request setHTTPMethod:@"POST"];

  NSDictionary *body = @{
    @"client_email": clientEmail,
    @"private_key": privateKey,
    @"scope": [scopes componentsJoinedByString:@" "],
    @"grant_type": @"urn:ietf:params:oauth:grant-type:jwt-bearer"
  };

  NSData *bodyData = [NSJSONSerialization dataWithJSONObject:body options:0 error:nil];
  [fetcher setRequestBody:bodyData];

  [fetcher beginFetchWithCompletionHandler:^(NSData *data, NSError *error) {
      if (error) {
          reject(@"fetch_error", @"Failed to fetch Google OAuth token", error);
      } else {
          NSDictionary *response = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
          NSString *accessToken = response[@"access_token"];
          resolve(accessToken);
      }
  }];
}

@end
